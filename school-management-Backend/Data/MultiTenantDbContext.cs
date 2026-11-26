using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using school_management_Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace school_management_Backend.Data
{
    public class MultiTenantDbContext : ApplicationDbContext
    {
        private readonly IConfiguration _configuration;
        private string _currentConnectionString;
        private bool _useMultiTenant = false;

        public MultiTenantDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
            // Check if multi-tenant is configured
            var databases = _configuration.GetSection("DatabaseConfig:Databases").Get<List<DatabaseConfig>>();
            _useMultiTenant = databases != null && databases.Any();
        }

        public void SetDatabase(string databaseName)
        {
            if (!_useMultiTenant) return; // Skip if not configured

            var databases = _configuration.GetSection("DatabaseConfig:Databases").Get<List<DatabaseConfig>>();
            var db = databases?.FirstOrDefault(x => x.Name == databaseName && x.IsActive);
            
            if (db != null)
            {
                _currentConnectionString = db.ConnectionString;
            }
        }

        public string GetCurrentDatabaseName()
        {
            if (!_useMultiTenant) return "DefaultConnection";
            
            var databases = _configuration.GetSection("DatabaseConfig:Databases").Get<List<DatabaseConfig>>();
            return databases?.FirstOrDefault(x => x.ConnectionString == _currentConnectionString)?.Name ?? "DefaultConnection";
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Only switch connection string if multi-tenant is configured AND a specific database is set
            if (_useMultiTenant && !string.IsNullOrEmpty(_currentConnectionString))
            {
                optionsBuilder.UseSqlServer(_currentConnectionString, sqlOptions =>
                {
                    sqlOptions.CommandTimeout(60);
                    sqlOptions.EnableRetryOnFailure(3);
                });
            }
            // Otherwise, use the default configuration from base class
            else
            {
                base.OnConfiguring(optionsBuilder);
            }
        }
    }
}