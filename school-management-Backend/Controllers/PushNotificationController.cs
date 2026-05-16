// Controllers/PushNotificationController.cs - FIXED RegisterDeviceFCM method
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using school_management_Backend.Models;
using school_management_Backend.Services;
using System.Text.Json;

namespace school_management_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PushNotificationController : ControllerBase
    {
        private readonly IPureFirebaseNotificationService _firebaseService;
        private readonly IPushNotificationService _pushService;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PushNotificationController> _logger;

        public PushNotificationController(
            IPureFirebaseNotificationService firebaseService,
            IPushNotificationService pushService,
            ApplicationDbContext context,
            ILogger<PushNotificationController> logger)
        {
            _firebaseService = firebaseService;
            _pushService = pushService;
            _context = context;
            _logger = logger;
        }

        #region FCM Registration - FIXED VERSION

        [HttpPost("register-device-fcm")]
        public async Task<IActionResult> RegisterDeviceFCM([FromBody] RegisterDeviceFCMDTO model)
        {
            try
            {
                _logger.LogInformation("📱 Registering FCM device for user {UserID}, Type: {UserType}", 
                    model.UserId, model.UserType);

                if (string.IsNullOrEmpty(model.FCMToken))
                    return BadRequest(new { Success = false, Message = "FCMToken is required" });

                // STEP 1: Try to find existing device with SAME TOKEN
                var existingDevice = await _context.UserDevices
                    .FirstOrDefaultAsync(d => d.UserID == model.UserId && d.FCMToken == model.FCMToken);
                
                if (existingDevice != null)
                {
                    // Update existing device
                    existingDevice.Platform = model.Platform ?? existingDevice.Platform;
                    existingDevice.DeviceModel = model.DeviceModel ?? existingDevice.DeviceModel;
                    existingDevice.AppVersion = model.AppVersion ?? existingDevice.AppVersion;
                    existingDevice.OSVersion = model.OSVersion ?? existingDevice.OSVersion;
                    existingDevice.IsActive = true;
                    existingDevice.LastActive = DateTime.Now;
                    existingDevice.UserType = model.UserType ?? existingDevice.UserType;
                    
                    await _context.SaveChangesAsync();
                    
                    _logger.LogInformation("✅ Updated existing FCM device for user {UserId}", model.UserId);
                    
                    return Ok(new { 
                        Success = true, 
                        Message = "FCM device updated successfully",
                        TokenType = "FCM"
                    });
                }

                // STEP 2: Check for ANY existing device for this user (to handle unique constraint)
                var anyUserDevice = await _context.UserDevices
                    .FirstOrDefaultAsync(d => d.UserID == model.UserId);
                
                if (anyUserDevice != null)
                {
                    // Update the existing device with new token
                    _logger.LogInformation("🔄 User {UserId} has existing device {DeviceId}, updating token", 
                        model.UserId, anyUserDevice.DeviceID);
                    
                    anyUserDevice.FCMToken = model.FCMToken;
                    anyUserDevice.Platform = model.Platform ?? anyUserDevice.Platform;
                    anyUserDevice.DeviceModel = model.DeviceModel ?? anyUserDevice.DeviceModel;
                    anyUserDevice.AppVersion = model.AppVersion ?? anyUserDevice.AppVersion;
                    anyUserDevice.OSVersion = model.OSVersion ?? anyUserDevice.OSVersion;
                    anyUserDevice.IsActive = true;
                    anyUserDevice.LastActive = DateTime.Now;
                    anyUserDevice.UserType = model.UserType ?? anyUserDevice.UserType;
                    
                    await _context.SaveChangesAsync();
                    
                    _logger.LogInformation("✅ Updated existing device with new FCM token");
                    
                    return Ok(new { 
                        Success = true, 
                        Message = "FCM device updated successfully",
                        TokenType = "FCM"
                    });
                }

                // STEP 3: No existing device found, create new one
                var newDevice = new UserDevice
                {
                    UserID = model.UserId,
                    UserType = model.UserType ?? "PARENT",
                    FCMToken = model.FCMToken,
                    ExpoToken = null,
                    Platform = model.Platform ?? "ANDROID",
                    DeviceModel = model.DeviceModel ?? "Unknown",
                    AppVersion = model.AppVersion ?? "1.0.0",
                    OSVersion = model.OSVersion ?? "Unknown",
                    IsActive = true,
                    LastActive = DateTime.Now,
                    CreatedDate = DateTime.Now
                };
                
                _context.UserDevices.Add(newDevice);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("✅ Created new FCM device for user {UserId}", model.UserId);
                
                return Ok(new { 
                    Success = true, 
                    Message = "FCM device registered successfully",
                    TokenType = "FCM"
                });
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("UNIQUE KEY") == true)
            {
                _logger.LogWarning(ex, "⚠️ Unique constraint violation, attempting recovery for user {UserId}", model.UserId);
                
                // RECOVERY: Try to find and update ANY device for this user
                try
                {
                    var recoveryDevice = await _context.UserDevices
                        .FirstOrDefaultAsync(d => d.UserID == model.UserId);
                    
                    if (recoveryDevice != null)
                    {
                        recoveryDevice.FCMToken = model.FCMToken;
                        recoveryDevice.Platform = model.Platform ?? recoveryDevice.Platform;
                        recoveryDevice.DeviceModel = model.DeviceModel ?? recoveryDevice.DeviceModel;
                        recoveryDevice.AppVersion = model.AppVersion ?? recoveryDevice.AppVersion;
                        recoveryDevice.OSVersion = model.OSVersion ?? recoveryDevice.OSVersion;
                        recoveryDevice.LastActive = DateTime.Now;
                        recoveryDevice.IsActive = true;
                        recoveryDevice.UserType = model.UserType ?? recoveryDevice.UserType;
                        
                        await _context.SaveChangesAsync();
                        
                        _logger.LogInformation("✅ Recovery successful - updated existing device");
                        
                        return Ok(new { 
                            Success = true, 
                            Message = "FCM device updated successfully (recovered)",
                            TokenType = "FCM"
                        });
                    }
                }
                catch (Exception recoveryEx)
                {
                    _logger.LogError(recoveryEx, "❌ Recovery failed");
                }
                
                return Conflict(new { 
                    Success = false, 
                    Message = "Device registration conflict. Please try again." 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error registering FCM device for user {UserId}", model.UserId);
                return StatusCode(500, new { 
                    Success = false, 
                    Message = $"Internal server error: {ex.Message}" 
                });
            }
        }

        #endregion

        #region Expo Registration (Legacy)

        [HttpPost("register-device")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterDevice([FromBody] RegisterDeviceDTO model)
        {
            try
            {
                _logger.LogInformation("📱 Registering Expo device for user {UserID}", model.UserID);

                if (string.IsNullOrEmpty(model.ExpoToken))
                    return BadRequest(new { Success = false, Message = "Expo token is required" });

                // Check if device already exists
                var existingDevice = await _context.UserDevices
                    .FirstOrDefaultAsync(d => d.UserID == model.UserID && d.ExpoToken == model.ExpoToken);
                
                if (existingDevice != null)
                {
                    existingDevice.IsActive = true;
                    existingDevice.LastActive = DateTime.Now;
                    existingDevice.FCMToken = model.FCMToken ?? existingDevice.FCMToken;
                    existingDevice.AppVersion = model.AppVersion ?? existingDevice.AppVersion;
                    existingDevice.OSVersion = model.OSVersion ?? existingDevice.OSVersion;
                    existingDevice.DeviceModel = model.DeviceModel ?? existingDevice.DeviceModel;
                    existingDevice.Platform = model.Platform ?? existingDevice.Platform;
                }
                else
                {
                    // Check if user has any device
                    var anyDevice = await _context.UserDevices
                        .FirstOrDefaultAsync(d => d.UserID == model.UserID);
                    
                    if (anyDevice != null)
                    {
                        // Update existing device with Expo token
                        anyDevice.ExpoToken = model.ExpoToken;
                        anyDevice.FCMToken = model.FCMToken ?? anyDevice.FCMToken;
                        anyDevice.IsActive = true;
                        anyDevice.LastActive = DateTime.Now;
                        anyDevice.Platform = model.Platform ?? anyDevice.Platform;
                        anyDevice.DeviceModel = model.DeviceModel ?? anyDevice.DeviceModel;
                        anyDevice.AppVersion = model.AppVersion ?? anyDevice.AppVersion;
                        anyDevice.OSVersion = model.OSVersion ?? anyDevice.OSVersion;
                        
                        await _context.SaveChangesAsync();
                        
                        _logger.LogInformation("✅ Updated existing device with Expo token");
                        
                        return Ok(new { 
                            Success = true, 
                            Message = "Device updated with Expo token",
                            TokenType = "Expo"
                        });
                    }
                    
                    // Create new device
                    var device = new UserDevice
                    {
                        UserID = model.UserID,
                        UserType = model.UserType ?? "PARENT",
                        ExpoToken = model.ExpoToken,
                        FCMToken = model.FCMToken,
                        Platform = model.Platform ?? "ANDROID",
                        DeviceModel = model.DeviceModel ?? "Unknown",
                        AppVersion = model.AppVersion ?? "1.0.0",
                        OSVersion = model.OSVersion ?? "Unknown",
                        IsActive = true,
                        LastActive = DateTime.Now,
                        CreatedDate = DateTime.Now
                    };
                    
                    _context.UserDevices.Add(device);
                }
                
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("✅ Registered Expo device for user {UserID}", model.UserID);
                
                return Ok(new { 
                    Success = true, 
                    Message = "Device registered successfully",
                    TokenType = "Expo"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error registering device");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        [HttpPost("unregister-device")]
        public async Task<IActionResult> UnregisterDevice([FromBody] RegisterDeviceDTO model)
        {
            try
            {
                var query = _context.UserDevices.Where(d => d.UserID == model.UserID);
                
                if (!string.IsNullOrEmpty(model.ExpoToken))
                    query = query.Where(d => d.ExpoToken == model.ExpoToken);
                else if (!string.IsNullOrEmpty(model.FCMToken))
                    query = query.Where(d => d.FCMToken == model.FCMToken);
                
                var device = await query.FirstOrDefaultAsync();
                
                if (device != null)
                {
                    device.IsActive = false;
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("✅ Unregistered device for user {UserID}", model.UserID);
                }
                
                return Ok(new { Success = true, Message = "Device unregistered successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error unregistering device");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        #endregion

        #region Send Notifications

        [HttpPost("send-fcm")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> SendFirebaseNotification([FromBody] SendFirebaseNotificationDTO model)
        {
            try
            {
                var result = await _firebaseService.SendNotificationAsync(model);
                return Ok(new { Success = result.Success, Message = result.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error sending Firebase notification");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        [HttpPost("send")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> SendPushNotification([FromBody] SendPushNotificationDTO model)
        {
            try
            {
                var result = await _pushService.SendPushNotificationAsync(model);
                return Ok(new { Success = result.Success, Message = result.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error sending Expo notification");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        [HttpPost("send-to-user/{userId}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> SendToUser(int userId, [FromBody] SendToUserNotificationDTO model)
        {
            try
            {
                var device = await _context.UserDevices
                    .Where(d => d.UserID == userId && d.IsActive)
                    .OrderByDescending(d => d.LastActive)
                    .FirstOrDefaultAsync();
                
                if (device == null)
                    return NotFound(new { Success = false, Message = "No active device found" });

                bool isFCM = !string.IsNullOrEmpty(device.FCMToken);
                string token = isFCM ? device.FCMToken : device.ExpoToken;
                
                if (string.IsNullOrEmpty(token))
                    return BadRequest(new { Success = false, Message = "No valid token" });

                object result;
                
                if (isFCM)
                {
                    result = await _firebaseService.SendNotificationAsync(new SendFirebaseNotificationDTO
                    {
                        FCMToken = token,
                        Title = model.Title,
                        Message = model.Message,
                        Data = model.Data
                    });
                }
                else
                {
                    result = await _pushService.SendPushNotificationAsync(new SendPushNotificationDTO
                    {
                        ExpoToken = token,
                        Title = model.Title,
                        Message = model.Message,
                        Data = model.Data
                    });
                }
                
                return Ok(new { 
                    Success = ((dynamic)result).Success, 
                    Message = ((dynamic)result).Message,
                    TokenType = isFCM ? "FCM" : "Expo"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error sending notification");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        #endregion

        #region Device Queries

        [HttpGet("devices/{userId}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetUserDevices(int userId)
        {
            try
            {
                var devices = await _context.UserDevices
                    .Where(d => d.UserID == userId)
                    .Select(d => new
                    {
                        d.DeviceID,
                        d.UserID,
                        d.UserType,
                        d.ExpoToken,
                        d.FCMToken,
                        TokenPreview = !string.IsNullOrEmpty(d.FCMToken) 
                            ? d.FCMToken.Substring(0, Math.Min(20, d.FCMToken.Length)) + "..." 
                            : !string.IsNullOrEmpty(d.ExpoToken)
                                ? d.ExpoToken.Substring(0, Math.Min(20, d.ExpoToken.Length)) + "..."
                                : "No token",
                        d.Platform,
                        d.DeviceModel,
                        d.AppVersion,
                        d.OSVersion,
                        d.IsActive,
                        d.LastActive
                    })
                    .ToListAsync();
                
                return Ok(new { Success = true, Data = devices });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting devices");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        [HttpGet("stats")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var total = await _context.UserDevices.CountAsync();
                var active = await _context.UserDevices.CountAsync(d => d.IsActive);
                var fcm = await _context.UserDevices.CountAsync(d => !string.IsNullOrEmpty(d.FCMToken));
                var expo = await _context.UserDevices.CountAsync(d => !string.IsNullOrEmpty(d.ExpoToken));
                
                return Ok(new
                {
                    Success = true,
                    Data = new
                    {
                        TotalDevices = total,
                        ActiveDevices = active,
                        FCMDevices = fcm,
                        ExpoDevices = expo
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting stats");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        #endregion
    }

    #region DTOs

    public class RegisterDeviceFCMDTO
    {
        public int UserId { get; set; }
        public string FCMToken { get; set; }
        public string UserType { get; set; }
        public string Platform { get; set; }
        public string DeviceModel { get; set; }
        public string AppVersion { get; set; }
        public string OSVersion { get; set; }
    }

    public class SendToUserNotificationDTO
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public int? Priority { get; set; }
    }

    #endregion
}