Arquitectura de Microservicios
Documento de Diseño
Microservicio Elegido 
Microservicio de Cupones de Descuento
Propósito del microservicio 
Este microservicio se encarga de aplicar códigos de cupones de descuento a artículos que tenga en el carro de compras.
También se encarga de listar, crear, eliminar descuentos en el sistema.

Las reglas parametrizables son:
Si la fecha actual es menor o igual a la fecha de fin de canje del cupón y canjeado es igual falso, entonces el código tiene el estado “Válido para ser canjeado”
Si la fecha actual es mayor a la fecha de fin de canje del cupón, entonces el código tiene el estado “Inválido para ser canjeado”
Si canjeado es igual a verdadero, entonces el código tiene el estado “Código canjeado”

Para realizar estas acciones, el microservicio se comunica con los siguientes recursos:

Auth: Para la administración de los códigos de descuento existentes en el sistema, se debe validar que el usuario sea Admin.
RabbitMQ: Envía las notificaciones y alertas cuando se realiza una modificación de un descuento, para ser aplicado en las transacciones pendientes que tengan artículos que apliquen ese descuento.
Casos de usos
CU 1
Crea un descuento en el sistema, para posteriormente ser aplicado en algún artículo.
URL:
POST /v1/discounts
Body
{
    "percentage": "{percentage value}",
    "redeemed": "{redeemed value}",
    "endLife": "{endLife value}",
}
Header de Autorización
Authorization=bearer {token}
Respuesta de éxito
# HTTP/1.1 200 OK
[
  {
    "_id": "{discount id}",
    "percentage": "{percentage value}",
    "redeemed": "{redeemed value}",
    "endLife": "{endLife date}",
    "created": "{created date}",
    "modified": "{modified date}",
    "status": "{status value}",
  }
]
Respuesta de Error
401 Unauthorized
# HTTP/1.1 401 Unauthorized
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "path" : "{property name}",
    "message" : "{error cause}"
}
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "error" : "{error cause}"
}
500 Server Error
# HTTP/1.1 500 Server Error
{
    "statusCode" : "{code error}",
    “message”: “{message cause}”
}
CU 2
Listar todos los descuentos no eliminados del sistema.
URL:
GET /v1/search/discounts?status=:parameter
Parameter puede ser active, deleted
La diferencia es que el active devuelve todos los q tienen el status en activo y el deleted devuelve todos los que tienen el status en borrado.
Header de Autorización
Authorization=bearer {token}
Respuesta de éxito
# HTTP/1.1 200 OK
[
   {
    "_id": "{discount id}",
    "percentage": "{percentage value}",
    "redeemed": "{redeemed value}",
    "endLife": "{endLife date}",
    "created": "{created date}",
    "modified": "{modified date}",
    "status": "{status value}",
   }
]
Respuesta de Error
401 Unauthorized
# HTTP/1.1 401 Unauthorized
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "path" : "{property name}",
    "message" : "{error cause}"
}
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "error" : "{error cause}"
}
500 Server Error
# HTTP/1.1 500 Server Error
{
    "statusCode" : "{code error}",
    “message”: “{message cause}”
}
CU 3
Dar de baja un descuento específico.
No se puede eliminar un descuento ya eliminado.
URL:
DELETE /v1/discounts/:discountId
Header de Autorización
Authorization=bearer {token}
Respuesta de éxito
# HTTP/1.1 200 OK
[
  {
    "status": "{status value}",
  }
]
Respuesta de Error
401 Unauthorized
# HTTP/1.1 401 Unauthorized
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "path" : "{property name}",
    "message" : "{error cause}"
}
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "error" : "{error cause}"
}
500 Server Error
# HTTP/1.1 500 Server Error
{
    "statusCode" : "{code error}",
    “message”: “{message cause}”
}
CU 4
Actualizar un descuento específico.
No se puede actualizar un descuento que esté reclamado.
Cuando se actualiza un descuento su estado pasa a active.
URL:
PATCH /v1/discounts/:discountId
Body
{
    "percentage": "{percentage value}",
    "redeemed": "{redeemed value}",
    "endLife": "{endLife value}",
    “modified”: “{modified date value”
}
Header de Autorización
Authorization=bearer {token}
Respuesta de éxito
# HTTP/1.1 200 OK
[
  {
    "discountId": "{discount id}",
    "modified": "{modified value}",
  }
]
Respuesta de Error
401 Unauthorized
# HTTP/1.1 401 Unauthorized
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "path" : "{property name}",
    "message" : "{error cause}"
}
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "error" : "{error cause}"
}
500 Server Error
# HTTP/1.1 500 Server Error
{
    "statusCode" : "{code error}",
    “message”: “{message cause}”
}
CU 5
Obtener un descuento específico.
URL:
GET /v1/discounts/:discountId
Header de Autorización
Authorization=bearer {token}
Respuesta de éxito
# HTTP/1.1 200 OK
[
  {
    "_id": "{discount id}",
    "percentage": "{percentage value}",
    "redeemed": "{redeemed value}",
    "endLife": "{endLife date}",
    "created": "{created date}",
    "modified": "{modified date}",
    "status": "{status value}",
  }
]
Respuesta de Error
401 Unauthorized
# HTTP/1.1 401 Unauthorized
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "path" : "{property name}",
    "message" : "{error cause}"
}
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "error" : "{error cause}"
}
500 Server Error
# HTTP/1.1 500 Server Error
{
    "statusCode" : "{code error}",
    “message”: “{message cause}”
}
CU 6
Aplicar descuento a orden de compra.
Solo se le puede aplicar un descuento a una orden.
Solo se puede usar el código de descuento una única vez.
URL:
POST /v1/redeem/:discount_id/discount
Header de Autorización
Authorization=bearer {token}
Body
{
    "orderId": "{order id value}",
}
Respuesta de éxito
# HTTP/1.1 200 OK
[
  {
    "discountId": "{discount id value}",
    "orderId": "{order id value}",
  }
]
Respuesta de Error
401 Unauthorized
# HTTP/1.1 401 Unauthorized
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "path" : "{property name}",
    "message" : "{error cause}"
}
400 Bad Request
# HTTP/1.1 400 Bad Request
{
    "error" : "{error cause}"
}
500 Server Error
# HTTP/1.1 500 Server Error
{
    "statusCode" : "{code error}",
    “message”: “{message cause}”
}
Mensajes Asíncronos
RabbitMQ
POST
Cambio de porcentaje de descuento
Notifica el cambio del porcentaje de un descuento para el cálculo del precio del artículo en las transacciones pendientes, específicamente, el atributo percentage

DIRECT discount/discount_update

{
    "type":"change",
    "message":{
        "discountId": {id of the discount},
        "percentage": {new percentage for the discount},
    }
}
ANEXO
Las tecnologías a utilizar son las siguientes:
Entorno de ejecución: Node js
Framework: Nest js
Lenguaje: TypeScript
Editor de texto: Visual Code
Base de datos: Mongo DB
Conector de base de datos: Mongoose
