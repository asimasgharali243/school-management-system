using Microsoft.AspNetCore.Mvc;
using school_management_Backend.Data;
using school_management_Backend.Services;
using System.Security.Claims;

namespace school_management_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
        private MultiTenantDbContext _dbContext;
        private IDatabaseResolver _dbResolver;

        protected MultiTenantDbContext DbContext
        {
            get
            {
                if (_dbContext == null)
                {
                    _dbContext = HttpContext.RequestServices.GetRequiredService<MultiTenantDbContext>();
                    
                    // Only apply multi-tenant logic if enabled
                    var dbResolver = HttpContext.RequestServices.GetRequiredService<IDatabaseResolver>();
                    if (dbResolver.IsMultiTenantEnabled())
                    {
                        var databaseName = User.FindFirst("Database")?.Value;
                        if (!string.IsNullOrEmpty(databaseName))
                        {
                            _dbContext.SetDatabase(databaseName);
                        }
                    }
                }
                return _dbContext;
            }
        }

        protected IDatabaseResolver DatabaseResolver
        {
            get
            {
                if (_dbResolver == null)
                {
                    _dbResolver = HttpContext.RequestServices.GetRequiredService<IDatabaseResolver>();
                }
                return _dbResolver;
            }
        }

        protected int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return 0;
            }
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        protected bool IsAdmin()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            return role == "Admin" || role == "admin" || role == "SuperAdmin";
        }
        
        protected bool IsMultiTenantEnabled()
        {
            return DatabaseResolver.IsMultiTenantEnabled();
        }
    }
}