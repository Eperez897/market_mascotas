### Volúmenes de datos actuales y proyectados:
El proyecto ahora esta funcionando para un uso local, administrando solo una tienda, aunque mas adelante se planea que llegue a ser una página para varios negocios a la ves

Actualmente contamos con un volúmen de:

-productos: 500-1000 documentos
-categorias: 10-20 documentos
-empresas:50-100 documentos
-usuarios:3-10 documentos
-facturas: 200-500 documentos por mes
-notificaciones: 300-600 documentos

Proyección a futuro (12 meses):

-productos: 2000-3000 documentos
-categorias: 30-50 documentos
-empresas: 300-500 documentos
-usuarios: 20-30 documentos
-facturas: 1500-2000 documentos por mes
-notificaciones: 1000-1200 documentos

### Requisitos de rendimiento y disponibilidad:
El rendimiento se basa en la gestion de los datos, agregar, eliminar, modificar productos, lo mismo con facturas que estaran conectadas con los productos, y empresas, se podran agregar o eliminar empresas para las facturas, pedira claves primarias y calculará precios con o sin iva, los productos podran ver modificados con SKU, Código de barras, nombre, stock y precios, en el punto de venta se podran realizar pedidos.

La disponibilidad estara divididad entre administrador y usuarios, el administrador tendra permisos totales sobre las bases de datos pudiendo  modificar, agregar, eliminar datos en cualquiera de los espacios, tambien podrá administrar a los usuarios, mientras que el usuario solo podra acceder, midificar, agregar y eliminar datos en su propio espacio de trabajo.

### Requisitos técnicos del DBMS MongoDB:
MongoDB tiene los siguentes requisitos minimos:
CPU:
    mínimo: 1 núcleo
    recomendado: 2-4 núcleos

RAM:
    mínimo: 1GB
    recomendado: 4GB

Almacenamiento:
    mínimo: 3GB
    recomendado: 20GB

Sistema de archivos:
    recomendado: XFS
    
Arquitectura:
    recomendado: x96_64
    
Software base:
    recomendado: .NET runtime
    
### Compara sistema operativos compatibles con MongoDB
Linux:
    compatibilidad: Completa.
    Rendimiento: Alto, menor sobrecarga del kernel.
    Administración:CLI Systemd
    Seguridad: SELinux/AppArmor, iptables, actualizaciones frecuentes.
    Costos de licenciamiento: Gratuito (distribuciones open source)
    Ecosistema cloud (Vercel/Render/Atlas): Nativo

Windows:
    compatibilidad: Completa.
    Rendimiento: Medio-alto, mayor consumo de recursos base.
    Administración: GUI + PowerShell.
    Seguridad: Windows Defender, políticas de grupo (GPO)
    Costos de licenciamiento: Licencia de Windows de pago.
    Ecosistema cloud (Vercel/Render/Atlas): Lo soporta.

macOS:
    compatibilidad: Solo desarrollo, no producción.
    Rendimiento: No aplica a la producción.
    Administración: Uso local.
    Seguridad: No evaluado para producción.
    Costos de licenciamiento: No aplica.
    Ecosistema cloud (Vercel/Render/Atlas): No lo soporta.



### Selecciona el sistema operativo justificando técnicamente la elección:
Decidimos realizar el trabajo en windows principalmente por ser un sistema operativo que manejamos con facilidad, mantiene un rendimiento y compatibilidad alto, y soporta el ecosistema cloud.

### Especificaciones tácticas del sistema operativo seleccionado:
El sistema operativo que trabajamos para crear el proyecto cuenta con:
CPU: 4 núcleos

RAM: 4 GB

Almacenamiento: 100 GB

### Selecciona la plataforma de virtualización apropiada:
Seleccionamos Render para el backend por su compatibilidad, rendimiento, y una administración mas libre, mientras que vercel lo utilizamos para el frontend por su optimizacion, velocidad y desplieges rapidos.

### Documenta el procedimiento de instalación y configuración de MongoDB:

![Imagen de instalación](mongo1.jpeg)
![Imagen de instalación](mongo2.jpeg)
![Imagen de instalación](mongo3.jpeg)
![Imagen de instalación](mongo4.jpeg)
![Imagen de instalación](mongo5.jpeg)
![Imagen de instalación](mongo6.jpeg)
![Imagen de instalación](mongo7.jpeg)
![Imagen de instalación](mongo8.jpeg)
![Imagen de instalación](mongo9.jpeg)
![Imagen de instalación](mongo10.jpeg)
![Imagen de instalación](mongo11.jpeg)
![Imagen de instalación](mongo12.jpeg)

### Configuraciones de seguridad de Mongo:
-Cifrado en tránsito: MongoDB Atlas exige TLS/SSL por defecto en todas las conexiones; en el entorno local se puede habilitar net.tls.mode: requireTLS con certificados propios para paridad con producción.


-Restricción de red: en Atlas se configura una lista de acceso (IP Access List) que solo permite las IPs salientes del servicio de Render; en el contenedor local, ufw restringe el puerto 27017 solo a la IP del backend.


-Auditoría: Atlas registra logs de auditoría de operaciones administrativas y de autenticación fallida; en el entorno local se habilita systemLog con logAppend: true para no perder el historial entre reinicios.


-Copias de respaldo: Atlas ofrece backups continuos e instantáneas (snapshots) programadas; en el entorno local se documenta mongodump como mecanismo de respaldo manual/programado.


### Documenta las estructuras de base de datos creadas:
-productos y categorias: se dejó strict: false para permitir campos adicionales sin migraciones, dado que el catálogo de una tienda de mascotas suele incorporar atributos nuevos (peso, marca, fecha de vencimiento) con el tiempo.


-facturas: usa un índice compuesto único { code, company } para permitir que dos empresas distintas tengan facturas con el mismo número correlativo sin colisionar.


-usuarios: separa permissions como subdocumento embebido de booleanos, lo que permite consultar y actualizar permisos de forma atómica con un solo PATCH.


-notifications: usa refId genérico (sin ref fijo) para poder apuntar a distintos tipos de documento origen (producto, categoría o factura) desde una única colección, evitando duplicar el modelo de notificación por cada entidad.

### Arquitectura de despliege implementada

El sistema quedó desplegado en un modelo de tres capas.:


Frontend: Hecho con React19 + Typescript + Vite, desplegado en Vercel principalmente para la interfaz del POS y paneles administrativos.

Backend: Hecho con Node.js + Express + Mongoose, desplegado en Render principalmente para la API, autenticación JWT, y el CRUD.

Base de datos: Hecho con MongoDB se utiliza para almacenar los datos de productos, facturas, empresas, usuarios y notificaciones.