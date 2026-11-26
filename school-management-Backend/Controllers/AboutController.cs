// Controllers/AboutController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using school_management_Backend.DTOs;
using school_management_Backend.Services;
using System;
using System.Threading.Tasks;
using school_management_Backend.Models;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AboutController : BaseApiController
    {
        private readonly IAboutService _aboutService;

        public AboutController(IAboutService aboutService)
        {
            _aboutService = aboutService;
        }

        /// <summary>
        /// Get all about settings (Public Access)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<AboutResponseDTO>> GetAboutSettings()
        {
            try
            {
                var result = await _aboutService.GetAboutSettingsAsync();
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get single setting by key (Public Access)
        /// </summary>
        [HttpGet("{key}")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> GetSettingByKey(string key)
        {
            try
            {
                var result = await _aboutService.GetSettingByKeyAsync(key);
                if (result == null)
                    return NotFound(new { success = false, message = "Setting not found" });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update setting by key (Admin only)
        /// </summary>
        [HttpPut("{key}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateSetting(string key, [FromBody] UpdateSettingDTO model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.SettingValue))
                    return BadRequest(new { success = false, message = "Setting value cannot be empty" });

                var result = await _aboutService.UpdateSettingAsync(key, model.SettingValue);
                if (!result)
                    return NotFound(new { success = false, message = "Setting not found" });

                return Ok(new { success = true, message = "Setting updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Create new setting (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<AboutSetting>> CreateSetting([FromBody] CreateSettingDTO model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data" });

                var result = await _aboutService.CreateSettingAsync(model);
                return Ok(new { success = true, message = "Setting created successfully", data = result });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Delete setting by key (Admin only)
        /// </summary>
        [HttpDelete("{key}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteSetting(string key)
        {
            try
            {
                var result = await _aboutService.DeleteSettingAsync(key);
                if (!result)
                    return NotFound(new { success = false, message = "Setting not found" });

                return Ok(new { success = true, message = "Setting deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Bulk update multiple settings (Admin only)
        /// </summary>
        [HttpPut("bulk")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> BulkUpdateSettings([FromBody] Dictionary<string, string> settings)
        {
            try
            {
                var updatedCount = 0;
                foreach (var setting in settings)
                {
                    var result = await _aboutService.UpdateSettingAsync(setting.Key, setting.Value);
                    if (result) updatedCount++;
                }

                return Ok(new { success = true, message = $"{updatedCount} settings updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}