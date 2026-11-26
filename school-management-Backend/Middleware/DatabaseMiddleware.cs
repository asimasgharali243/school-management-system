// using Microsoft.AspNetCore.Http;
// using school_management_Backend.Data;
// using school_management_Backend.Services;
// using System.Linq;
// using System.Threading.Tasks;

// namespace school_management_Backend.Middleware
// {
//     public class DatabaseMiddleware
//     {
//         private readonly RequestDelegate _next;

//         public DatabaseMiddleware(RequestDelegate next)
//         {
//             _next = next;
//         }

//         public async Task InvokeAsync(HttpContext context, IDatabaseResolver dbResolver, MultiTenantDbContext dbContext)
//         {
//             // Only apply multi-tenant logic if enabled
//             if (dbResolver.IsMultiTenantEnabled())
//             {
//                 var databaseName = context.User?.Claims?.FirstOrDefault(c => c.Type == "Database")?.Value;
                

//                   // ✅ ADD THIS LOG
//             Console.WriteLine($"🔍 [DATABASE MIDDLEWARE] Request Path: {context.Request.Path}");
//             Console.WriteLine($"🔍 [DATABASE MIDDLEWARE] User: {context.User?.Identity?.Name ?? "Anonymous"}");
//             Console.WriteLine($"🔍 [DATABASE MIDDLEWARE] Setting database to: {databaseName}");
            
//                 if (!string.IsNullOrEmpty(databaseName))
//                 {
//                     dbResolver.SetCurrentDatabase(databaseName);
//                     dbContext.SetDatabase(databaseName);
//                 }
//             }

//             await _next(context);
//         }
//     }
// }
using Microsoft.AspNetCore.Http;
using school_management_Backend.Data;
using school_management_Backend.Services;
using System.Linq;
using System.Threading.Tasks;

namespace school_management_Backend.Middleware
{
    public class DatabaseMiddleware
    {
        private readonly RequestDelegate _next;

        public DatabaseMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IDatabaseResolver dbResolver, MultiTenantDbContext dbContext)
        {
            // Log request start
            Console.WriteLine($"");
            Console.WriteLine($"╔═══════════════════════════════════════════════════════════════");
            Console.WriteLine($"║ [DATABASE MIDDLEWARE] START");
            Console.WriteLine($"║ Time: {DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}");
            Console.WriteLine($"║ Request Path: {context.Request.Method} {context.Request.Path}");
            Console.WriteLine($"║ User: {context.User?.Identity?.Name ?? "Anonymous"}");
            Console.WriteLine($"╚═══════════════════════════════════════════════════════════════");

            // Only apply multi-tenant logic if enabled
            if (dbResolver.IsMultiTenantEnabled())
            {
                var databaseName = context.User?.Claims?.FirstOrDefault(c => c.Type == "Database")?.Value;
                
                Console.WriteLine($"║ [DB MIDDLEWARE] Multi-tenant ENABLED");
                Console.WriteLine($"║ [DB MIDDLEWARE] Database claim from JWT: {databaseName ?? "NULL"}");
                
                if (!string.IsNullOrEmpty(databaseName))
                {
                    Console.WriteLine($"║ [DB MIDDLEWARE] ✅ Setting database to: {databaseName}");
                    dbResolver.SetCurrentDatabase(databaseName);
                    dbContext.SetDatabase(databaseName);
                }
                else
                {
                    Console.WriteLine($"║ [DB MIDDLEWARE] ⚠️ No database claim in token - using default");
                }
            }
            else
            {
                Console.WriteLine($"║ [DB MIDDLEWARE] Multi-tenant DISABLED - using single database");
            }

            // Log before calling next middleware
            Console.WriteLine($"║ [DB MIDDLEWARE] Current database: {dbResolver.GetCurrentDatabase() ?? "Default"}");
            Console.WriteLine($"╚═══════════════════════════════════════════════════════════════");
            Console.WriteLine($"");

            await _next(context);
            
            // Log after request completes (optional)
            Console.WriteLine($"╔═══════════════════════════════════════════════════════════════");
            Console.WriteLine($"║ [DATABASE MIDDLEWARE] END - Response: {context.Response.StatusCode}");
            Console.WriteLine($"╚═══════════════════════════════════════════════════════════════");
            Console.WriteLine($"");
        }
    }
}