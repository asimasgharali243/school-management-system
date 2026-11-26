using System.Collections.Generic;

namespace school_management_Backend.Models
{
    public class DatabaseConfig
    {
        public string Name { get; set; }
        public string ConnectionString { get; set; }
        public bool IsActive { get; set; } = true;
    }
}