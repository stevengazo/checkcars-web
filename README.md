
# CheckCars Dashboard

CheckCars Dashboard es una aplicación web desarrollada con React que permite a las empresas gestionar y visualizar reportes de vehículos en tiempo real. Esta interfaz se conecta con la API de CheckCars para mostrar información detallada sobre salidas, entradas, averías y colisiones de la flota vehicular.


## 🚀 Características

- **Autenticación JWT**: Acceso seguro mediante tokens JWT.
- **Visualización en tiempo real**: Datos actualizados sobre el estado de los vehículos.
- **Interfaz responsiva**: Adaptable a diferentes dispositivos y tamaños de pantalla.
- **Integración con CheckCars API**: Comunicación fluida con el backend para operaciones CRUD.

## 🛠️ Tecnologías utilizadas

- **Frontend**: React, Vite
- **Backend**: [CheckCars API](https://github.com/stevengazo/checkcarsapi)
- **Base de datos**: Microsoft SQL Server
- **Contenedores**: Docker, Docker Compose


- **React** for the front-end framework.
- **Vite** as the build tool for fast development and optimized production builds.
- **Tailwind CSS** for styling.
- **React Router DOM** for routing.
- **JWT** for secure authentication.
- **Additional Packages:**
  - `@microsoft/signalr`
  - `@tailwindcss/vite`
  - `jspdf`
  - `leaflet` and `react-leaflet`
  - `react-icons`
  - `react-spinners`
  - `react-toastify`

## 🧪 Requisitos previos

- Docker y Docker Compose instalados en el sistema.
- Acceso a las imágenes de Docker:
  - `stevengazo/checkcarsapi`
  - `stevengazo/checkcars-web:latest`

## ⚙️ Configuración del entorno

1. Clona el repositorio:
   ```bash
   git clone https://github.com/stevengazo/checkcars-web.git
   cd checkcars-web
2. Crea un archivo `.env` con las siguientes variables:
     `VITE_API_URL=http://localhost:8080`


## 🐳 Despliegue con Docker Compose
Utiliza el siguiente archivo `docker-compose.yml` para levantar los servicios necesarios:

	version: '3.8'

	services:
	  sqlserver:
	    image: mcr.microsoft.com/mssql/server:2022-latest
	    container_name: sqlserver
	    ports:
	      - "1433:1433"
	    environment:
	      SA_PASSWORD: TuContraseñaSegura123!
	      ACCEPT_EULA: "Y"
	    volumes:
	      - sql_data:/var/opt/mssql
	    restart: always

	  checkcarsapi:
	    image: stevengazo/checkcarsapi
	    container_name: checkcarsapi
	    depends_on:
	      - sqlserver
	    ports:
	      - "8080:8080"
	    environment:
	      ASPNETCORE_ENVIRONMENT: Production

      # Configuración SMTP
      SMTP__Host: smtp.tuempresa.com
      SMTP__Port: 587
      SMTP__EnableSsl: true
      SMTP__Username: usuario@tuempresa.com
      SMTP__Password: contraseñaSMTP
      SMTP__From: noreply@tuempresa.com
      SMTP__DefaultEmail: admin@tuempresa.com

      # Archivos estáticos
      StaticFiles__ImagesPath: images

      # Conexiones a la base de datos
      ConnectionStrings__IdentityUsers: Server=sqlserver,1433;Database=CheckCarsUsers;User Id=sa;Password=TuContraseñaSegura123!;TrustServerCertificate=True;
      ConnectionStrings__ReportsConnection: Server=sqlserver,1433;Database=CheckCarsReports;User Id=sa;Password=TuContraseñaSegura123!;TrustServerCertificate=True;

      # JWT
      Jwt__Issuer: tuempresa.com
      Jwt__Audience: tuempresa.com
      Jwt__Key: claveJWTsupersecreta

    volumes:
      - ./images:/app/static/images
    restart: always

	  checkcarsweb:
	    image: stevengazo/checkcars-web:latest
	    container_name: checkcarsweb
	    ports:
	      - "3000:80"
	    depends_on:
	      - checkcarsapi
	    environment:
	      VITE_API_URL: http://checkcarsapi:8080
	    restart: always
	volumes:
	  sql_data:
**Nota**: Asegúrate de reemplazar las variables sensibles como contraseñas y claves JWT por valores seguros y adecuados para tu entorno de producción.



