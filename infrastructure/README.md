# Infraestructura AWS (CDK)

Backend opcional: Lambda + DynamoDB + SES para guardar puntajes del juego.

**Documentación completa de despliegue:** ver [README.md](../README.md) en la raíz del proyecto (sección *Infraestructura AWS*).

Comandos habituales (desde esta carpeta, perfil `cacao`):

```bash
npm install
aws sts get-caller-identity --profile cacao
cdk bootstrap --profile cacao    # solo la primera vez
cdk deploy --profile cacao
```
