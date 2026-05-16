// Models/UserDevice.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("UserDevices")]
    public class UserDevice
    {
        [Key]
        public int DeviceID { get; set; }
        
        public int UserID { get; set; }
        
        [Required]
        [StringLength(20)]
        public string UserType { get; set; }
        
        // Store both Expo and FCM tokens
        [StringLength(500)]
        public string? ExpoToken { get; set; }
        
        [StringLength(500)]
        public string FCMToken { get; set; }
        
        // Device Info
        [Required]
        [StringLength(10)]
        public string Platform { get; set; } // 'ANDROID', 'IOS', 'WEB'
        
        [StringLength(100)]
        public string DeviceModel { get; set; }
        
        [StringLength(20)]
        public string AppVersion { get; set; }
        
        [StringLength(20)]
        public string OSVersion { get; set; }
        
        // Status
        public bool IsActive { get; set; } = true;
        
        public DateTime LastActive { get; set; } = DateTime.Now;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        // Helper property to get the best token
        [NotMapped]
        public string PreferredToken => !string.IsNullOrEmpty(ExpoToken) ? ExpoToken : FCMToken;
    }
}