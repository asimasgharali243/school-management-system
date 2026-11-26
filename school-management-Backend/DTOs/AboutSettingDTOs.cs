// DTOs/AboutSettingDTOs.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace school_management_Backend.DTOs
{
    public class AboutSettingDTO
    {
        public int Id { get; set; }
        public string SettingKey { get; set; }
        public string SettingValue { get; set; }
        public string ValueType { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class AboutContentDTO
    {
        // Text Content
        public string AboutText { get; set; }
        public string MissionText { get; set; }
        public string VisionText { get; set; }
        
        // School Info
        public string SchoolName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string PhoneSecondary { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string OfficeHours { get; set; }
        
        // Social Media URLs
        public string FacebookUrl { get; set; }
        public string InstagramUrl { get; set; }
        public string TwitterUrl { get; set; }
        public string YoutubeUrl { get; set; }
        public string LinkedinUrl { get; set; }
        public string WhatsappNumber { get; set; }
        
        // Images
        public string AboutImage { get; set; }
        public string MissionImage { get; set; }
        public string VisionImage { get; set; }
    }

    public class AboutResponseDTO
    {
        public AboutContentDTO Content { get; set; }
        public List<SocialLinkDTO> SocialLinks { get; set; }
    }

    public class SocialLinkDTO
    {
        public string Platform { get; set; }
        public string Icon { get; set; }
        public string Url { get; set; }
    }

    public class UpdateSettingDTO
    {
        public string SettingValue { get; set; }
    }

    public class CreateSettingDTO
    {
        [Required]
        [MaxLength(50)]
        public string SettingKey { get; set; }

        [Required]
        public string SettingValue { get; set; }

        public string ValueType { get; set; } = "text";

        public int DisplayOrder { get; set; } = 0;
    }
}