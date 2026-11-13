# UnivalleShop — primera entrega (14 de noviembre de 2026)

## Qué contiene este paquete
Complementa el monorepositorio con Docker Compose (MongoDB + microservicio), endpoint REST
`POST /users`, control de correo institucional, validación básica, hash scrypt para
contraseñas y comprobación de salud `GET /health`.

**Importante:** Esto es un avance de primera entrega, NO una tienda terminada.
El filtro de dominio institucional NO confirma la vinculación universitaria.
Falta verificación de correo/autenticación, frontend y los demás servicios.

## Preparación (Windows PowerShell)
1. Instala y abre Docker Desktop (Linux containers / WSL 2).
2. Instala Git. En PowerShell ejecuta:

   ```powershell
   git clone https://github.com/JCDoradoB/UnivalleShop.git
   cd UnivalleShop
   ```

   Si ya lo tenías clonado, en lugar de clonarlo: `git status` y `git pull`
   **solo si no hay cambios locales sin guardar**. Haz una copia de seguridad antes.
3. Extrae el ZIP de este paquete y copia sus archivos **dentro de UnivalleShop**.
   Se combinarán las carpetas. Autoriza reemplazar SOLO los archivos que se indican.
4. Revisa cambios: `git status` y `git diff`.
5. Arranca: `docker compose up --build -d`.
6. Espera a que los contenedores inicien y verifica:

   ```powershell
   docker compose ps
   docker compose logs --tail=100 user-services
   Invoke-RestMethod http://localhost:3000/health
   ```

   Resultado esperado cuando el servidor y MongoDB están listos:
   `status: ok`, `service: user-services`, `database: connected`.

## Probar creación de usuario
En PowerShell (con los contenedores ejecutándose):

```powershell
$body = @{name='Usuario Demostracion';email='demo.primeraentrega@correounivalle.edu.co';password='ClaveFicticia123!'} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/users -ContentType 'application/json' -Body $body
```

Debes recibir HTTP 201 con `id`, `name`, `email`, `createdAt`;
**nunca** `password`. Utiliza únicamente datos inventados para la demostración.
Si repites el mismo correo debes recibir HTTP 409. Un correo externo debe recibir HTTP 400.

## Fallos comunes
- `docker` no se reconoce: instala Docker Desktop y reinicia la terminal.
- Docker daemon error: abre Docker Desktop y espera a que arranque.
- Puerto 3000 ocupado: cierra el proceso anterior o cambia `127.0.0.1:3000:3000` en docker-compose.yml.
- Puerto 27017 ocupado: elimina el bloque `ports` del servicio `mongo`, porque el backend se conecta por la red interna de Docker.
- Fallo en `npm ci`: revisa conexión a internet y que `package-lock.json` esté en la rama.
- `MONGODB_URI no está definida`: pasa con inicio manual sin .env; Docker Compose ya la define.
- Si la compilación falla: copia todo el error de `docker compose logs user-services` o del build, sin borrar archivos.
- Para detener: `docker compose down` (NO uses `-v` si deseas conservar los datos).

## Evidencias recomendadas
1. `docker compose ps` mostrando contenedores activos.
2. `GET /health` mostrando que MongoDB está conectado.
3. `POST /users` mostrando HTTP 201 y usuario creado, sin contraseña.
4. Captura de `git status` / commit subido a GitHub.
5. Estructura hexagonal en VS Code: dominio / caso de uso / puerto / adaptador.

## Por completar en las siguientes entregas
- Verificación real de pertenencia a Univalle y autenticación (JWT, login).
- Catálogo, pedidos, pagos, búsqueda y recomendaciones.
- API Gateway, base de datos aislada por microservicio, frontend React,
  pruebas de integración, y checklists de microservicios / arquitectura hexagonal.

## Guion breve de demostración
"En esta primera entrega desarrollamos la base del microservicio de usuarios en NestJS.
El dominio define la entidad User; la aplicación expone CreateUserUseCase; un puerto
UserRepository permite desacoplar la persistencia y un adaptador realiza el guardado
con MongoDB. Docker Compose levanta dos contenedores y el endpoint POST /users
permite crear un usuario de prueba con validaciones básicas. Todavía quedan
pendientes los demás servicios, el API Gateway y la verificación de la identidad
institucional para siguientes avances."
