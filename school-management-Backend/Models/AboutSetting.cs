// Models/AboutSetting.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("AboutSettings")]
    public class AboutSetting
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string SettingKey { get; set; }

        [Required]
        public string SettingValue { get; set; }

        [Required]
        [MaxLength(20)]
        public string ValueType { get; set; } = "text";

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}