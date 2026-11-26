// Services/IAboutService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using school_management_Backend.DTOs;
using school_management_Backend.Models;
namespace school_management_Backend.Services
{
    public interface IAboutService
    {
        Task<AboutResponseDTO> GetAboutSettingsAsync();
        Task<string> GetSettingByKeyAsync(string key);
        Task<bool> UpdateSettingAsync(string key, string value);
        Task<AboutSetting> CreateSettingAsync(CreateSettingDTO dto);
        Task<bool> DeleteSettingAsync(string key);
    }
}