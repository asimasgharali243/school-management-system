using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using school_management_Backend.Data;
using school_management_Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace school_management_Backend.Services
{
    public class DatabaseResolver : IDatabaseResolver
    {
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _serviceProvider;
        private string _currentDatabase = null;
        private readonly bool _isMultiTenantEnabled;

        public DatabaseResolver(IConfiguration configuration, IServiceProvider serviceProvider)
        {
            _configuration = configuration;
            _serviceProvider = serviceProvider;
            
            var databases = _configuration.GetSection("DatabaseConfig:Databases").Get<List<DatabaseConfig>>();
            _isMultiTenantEnabled = databases != null && databases.Any();
        }

        public bool IsMultiTenantEnabled()
        {
            return _isMultiTenantEnabled;
        }

        public async Task<string> ResolveDatabaseForUserAsync(string username, string password)
        {
            if (!_isMultiTenantEnabled)
            {
                return "DefaultConnection";
            }

            var databases = _configuration.GetSection("DatabaseConfig:Databases").Get<List<DatabaseConfig>>();
            
            if (databases == null || !databases.Any())
            {
                return "DefaultConnection";
            }

            foreach (var db in databases.Where(d => d.IsActive))
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<MultiTenantDbContext>();
                    context.SetDatabase(db.Name);
                    
                    // FIXED: Use 'tbl_User' instead of 'TblUsers'
                    var user = await context.tbl_User
                        .FirstOrDefaultAsync(u => u.UserName == username && u.Status == true);
                    
                    if (user != null)
                    {
                        _currentDatabase = db.Name;
                        return db.Name;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error checking database {db.Name}: {ex.Message}");
                    continue;
                }
            }

            return null;
        }

        public string GetCurrentDatabase()
        {
            return _currentDatabase;
        }

        public void SetCurrentDatabase(string databaseName)
        {
            _currentDatabase = databaseName;
        }
    }
}