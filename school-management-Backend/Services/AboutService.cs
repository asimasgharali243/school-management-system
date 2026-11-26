// Services/AboutService.cs
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using school_management_Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace school_management_Backend.Services
{
    public class AboutService : IAboutService
    {
        private readonly ApplicationDbContext _context;

        public AboutService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AboutResponseDTO> GetAboutSettingsAsync()
        {
            var settings = await _context.AboutSettings
                .Where(x => x.IsActive)
                .OrderBy(x => x.DisplayOrder)
                .ToListAsync();

            var content = new AboutContentDTO();
            var socialLinks = new List<SocialLinkDTO>();

            foreach (var setting in settings)
            {
                switch (setting.SettingKey)
                {
                    // Text Content
                    case "about_text":
                        content.AboutText = setting.SettingValue;
                        break;
                    case "mission_text":
                        content.MissionText = setting.SettingValue;
                        break;
                    case "vision_text":
                        content.VisionText = setting.SettingValue;
                        break;

                    // School Info
                    case "school_name":
                        content.SchoolName = setting.SettingValue;
                        break;
                    case "address":
                        content.Address = setting.SettingValue;
                        break;
                    case "phone":
                        content.Phone = setting.SettingValue;
                        break;
                    case "phone_secondary":
                        content.PhoneSecondary = setting.SettingValue;
                        break;
                    case "email":
                        content.Email = setting.SettingValue;
                        break;
                    case "website":
                        content.Website = setting.SettingValue;
                        break;
                    case "office_hours":
                        content.OfficeHours = setting.SettingValue;
                        break;

                    // Images
                    case "about_image":
                        content.AboutImage = setting.SettingValue;
                        break;
                    case "mission_image":
                        content.MissionImage = setting.SettingValue;
                        break;
                    case "vision_image":
                        content.VisionImage = setting.SettingValue;
                        break;

                    // Social Media
                    case "facebook_url":
                        content.FacebookUrl = setting.SettingValue;
                        socialLinks.Add(new SocialLinkDTO
                        {
                            Platform = "Facebook",
                            Icon = "facebook",
                            Url = setting.SettingValue
                        });
                        break;
                    case "instagram_url":
                        content.InstagramUrl = setting.SettingValue;
                        socialLinks.Add(new SocialLinkDTO
                        {
                            Platform = "Instagram",
                            Icon = "instagram",
                            Url = setting.SettingValue
                        });
                        break;
                    case "twitter_url":
                        content.TwitterUrl = setting.SettingValue;
                        socialLinks.Add(new SocialLinkDTO
                        {
                            Platform = "Twitter",
                            Icon = "twitter",
                            Url = setting.SettingValue
                        });
                        break;
                    case "youtube_url":
                        content.YoutubeUrl = setting.SettingValue;
                        socialLinks.Add(new SocialLinkDTO
                        {
                            Platform = "YouTube",
                            Icon = "youtube",
                            Url = setting.SettingValue
                        });
                        break;
                    case "linkedin_url":
                        content.LinkedinUrl = setting.SettingValue;
                        socialLinks.Add(new SocialLinkDTO
                        {
                            Platform = "LinkedIn",
                            Icon = "linkedin",
                            Url = setting.SettingValue
                        });
                        break;
                    case "whatsapp_number":
                        content.WhatsappNumber = setting.SettingValue;
                        var whatsappUrl = setting.SettingValue.StartsWith("+") 
                            ? $"https://wa.me/{setting.SettingValue.Replace("+", "")}"
                            : $"https://wa.me/{setting.SettingValue}";
                        socialLinks.Add(new SocialLinkDTO
                        {
                            Platform = "WhatsApp",
                            Icon = "whatsapp",
                            Url = whatsappUrl
                        });
                        break;
                }
            }

            return new AboutResponseDTO
            {
                Content = content,
                SocialLinks = socialLinks
            };
        }

        public async Task<string> GetSettingByKeyAsync(string key)
        {
            var setting = await _context.AboutSettings
                .FirstOrDefaultAsync(x => x.SettingKey == key && x.IsActive);

            return setting?.SettingValue;
        }

        public async Task<bool> UpdateSettingAsync(string key, string value)
        {
            var setting = await _context.AboutSettings
                .FirstOrDefaultAsync(x => x.SettingKey == key);

            if (setting == null)
                return false;

            setting.SettingValue = value;
            setting.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<AboutSetting> CreateSettingAsync(CreateSettingDTO dto)
        {
            var existing = await _context.AboutSettings
                .FirstOrDefaultAsync(x => x.SettingKey == dto.SettingKey);

            if (existing != null)
                throw new InvalidOperationException($"Setting with key '{dto.SettingKey}' already exists");

            var setting = new AboutSetting
            {
                SettingKey = dto.SettingKey,
                SettingValue = dto.SettingValue,
                ValueType = dto.ValueType,
                DisplayOrder = dto.DisplayOrder,
                IsActive = true,
                UpdatedAt = DateTime.UtcNow
            };

            _context.AboutSettings.Add(setting);
            await _context.SaveChangesAsync();

            return setting;
        }

        public async Task<bool> DeleteSettingAsync(string key)
        {
            var setting = await _context.AboutSettings
                .FirstOrDefaultAsync(x => x.SettingKey == key);

            if (setting == null)
                return false;

            _context.AboutSettings.Remove(setting);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}