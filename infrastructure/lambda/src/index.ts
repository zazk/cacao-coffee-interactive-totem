import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);

const sesClient = new SESClient({});

const TABLE_NAME = process.env.TABLE_NAME!;
const SENDER_EMAIL = process.env.SENDER_EMAIL!;
const GAME_ID = 'cacao'; // constant used for leaderboard

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ScorePayload {
  userId: string;
  email: string;
  name?: string;
  score: number;
  timeMs: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function response(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export const handler = async (event: {
  requestContext?: { http?: { method?: string } };
  httpMethod?: string;
  body?: string | null;
}) => {
  const method =
    event.requestContext?.http?.method?.toUpperCase() ??
    event.httpMethod?.toUpperCase() ??
    'GET';

  // ---- GET /scores → return top-20 leaderboard --------------------------------
  if (method === 'GET') {
    const result = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :g',
        ExpressionAttributeValues: { ':g': `LEADERBOARD#${GAME_ID}` },
        ScanIndexForward: false, // descending → highest score first
        Limit: 20,
      }),
    );

    const scores = (result.Items ?? []).map((item) => ({
      userId: item.PK.replace('USER#', ''),
      email: item.email,
      name: item.name,
      score: item.score,
      timeMs: item.timeMs,
      playedAt: item.SK.replace('GAME#', ''),
    }));

    return response(200, { scores });
  }

  // ---- POST /scores → save a new score entry ----------------------------------
  if (method === 'POST') {
    if (!event.body) {
      return response(400, { error: 'Request body is required' });
    }

    let payload: ScorePayload;
    try {
      payload = JSON.parse(event.body) as ScorePayload;
    } catch {
      return response(400, { error: 'Invalid JSON body' });
    }

    const { userId, email, name, score, timeMs } = payload;

    if (!userId || !email || score === undefined || timeMs === undefined) {
      return response(400, {
        error: 'Missing required fields: userId, email, score, timeMs',
      });
    }

    const MAX_SCORE = 100_000;
    const MIN_TIME_MS = 5_000;

    if (score < 0 || score > MAX_SCORE) {
      return response(400, { error: `Invalid score: must be between 0 and ${MAX_SCORE}` });
    }

    if (timeMs < MIN_TIME_MS) {
      return response(400, { error: `Invalid timeMs: must be at least ${MIN_TIME_MS}ms` });
    }

    const playedAt = new Date().toISOString();
    const userPK = `USER#${userId}`;
    const displayName = name ?? email;

    // Use TransactWriteCommand to reliably upsert user profile and insert the score event.
    await ddb.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Update: {
              TableName: TABLE_NAME,
              Key: { PK: userPK, SK: 'PROFILE' },
              UpdateExpression:
                'SET #type = :type, email = :email, #name = :name, lastPlayed = :playedAt, createdAt = if_not_exists(createdAt, :playedAt)',
              ExpressionAttributeNames: {
                '#type': 'type',
                '#name': 'name',
              },
              ExpressionAttributeValues: {
                ':type': 'USER',
                ':email': email,
                ':name': displayName,
                ':playedAt': playedAt,
              },
            },
          },
          {
            Put: {
              TableName: TABLE_NAME,
              Item: {
                PK: userPK,
                SK: `GAME#${playedAt}`,
                type: 'SCORE',
                score: score,
                timeMs: timeMs,
                email: email,
                name: displayName,
                GSI1PK: `LEADERBOARD#${GAME_ID}`,
                GSI1SK: score,
              },
            },
          },
        ],
      }),
    );

    // If player wins, send an email (assume max score is 8 for the win condition)
    if (score >= 8) {
      try {
        // 1. Email to the player
        await sesClient.send(
          new SendEmailCommand({
            Source: SENDER_EMAIL,
            Destination: { ToAddresses: [email] },
            Message: {
              Subject: { Data: '¡Felicidades, ganaste en Cacao!' },
              Body: {
                Text: {
                  Data: `Hola ${displayName},\n\n¡Has ganado con un puntaje de ${score} en Cacao!\n\nSaludos,\nEl equipo de Cacao`,
                },
              },
            },
          }),
        );
        console.log(`Successfully sent win email to player: ${email}`);

        // 2. Email to the admin (you)
        if (email !== SENDER_EMAIL) {
          await sesClient.send(
            new SendEmailCommand({
              Source: SENDER_EMAIL,
              Destination: { ToAddresses: [SENDER_EMAIL] },
              Message: {
                Subject: { Data: `🏆 Nuevo ganador en Cacao: ${displayName}` },
                Body: {
                  Text: {
                    Data: `Notificación de sistema:\n\nEl jugador ${displayName} (${email}) acaba de ganar el juego con un puntaje de ${score}.\nTiempo: ${timeMs}ms.\n\nSaludos,\nEl equipo de Cacao`,
                  },
                },
              },
            }),
          );
          console.log(`Successfully sent win notification to admin: ${SENDER_EMAIL}`);
        }
      } catch (err) {
        console.error('Failed to send email via SES:', err);
        // Do not block the request if email fails (often happens in SES Sandbox)
      }
    }

    return response(201, {
      message: 'Score saved ✅',
      score: {
        userId,
        email,
        name: displayName,
        score,
        timeMs,
        playedAt,
      },
    });
  }

  // ---- Unsupported method ------------------------------------------------------
  return response(405, { error: `Method ${method} not allowed` });
};