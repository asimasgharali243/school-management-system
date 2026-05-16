// HangfireAuthorizationFilter.cs

using Hangfire;  // Add this line - RecurringJob is in Hangfire namespace, not your project's Hangfire folder
using Hangfire.Dashboard;
using school_management_Backend.Hangfire;

namespace school_management_Backend
{
    public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            var httpContext = context.GetHttpContext();
            
            // DEVELOPMENT: Allow everyone
            var env = httpContext.RequestServices.GetService<IWebHostEnvironment>();
            if (env.IsDevelopment())
            {
                return true; // Allow all in development
            }
            
            // PRODUCTION: Check for JWT token in header
            var authHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                
                // For now, just check if token exists (in production, validate it properly)
                return !string.IsNullOrEmpty(token);
            }
            
            // Also check if user is authenticated via ASP.NET Core
            return httpContext.User?.Identity?.IsAuthenticated == true;
        }
    }
}