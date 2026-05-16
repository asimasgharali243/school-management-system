
// Services/HybridPushNotificationService.cs - Add HTML detection
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace school_management_Backend.Services
{
    public class HybridPushNotificationService : IPushNotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<HybridPushNotificationService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IPureFirebaseNotificationService _firebaseService;
        private readonly IConfiguration _configuration;

        public HybridPushNotificationService(
            ApplicationDbContext context,
            ILogger<HybridPushNotificationService> logger,
            IHttpClientFactory httpClientFactory,
            IPureFirebaseNotificationService firebaseService,
            IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _firebaseService = firebaseService;
            _configuration = configuration;
        }

        // public async Task<PushNotificationResult> SendPushNotificationAsync(SendPushNotificationDTO model)
        // {
        //     try
        //     {
        //         // Check if content is HTML
        //         bool isHtml = (model.Title?.Contains("<") == true && model.Title?.Contains(">") == true) ||
        //                      (model.Message?.Contains("<") == true && model.Message?.Contains(">") == true);

        //         // If we have a UserID but no ExpoToken, try to get it from the database
        //         if (model.UserID.HasValue && string.IsNullOrEmpty(model.ExpoToken))
        //         {
        //             var device = await _context.UserDevices
        //                 .FirstOrDefaultAsync(d => d.UserID == model.UserID.Value && d.IsActive);
                    
        //             if (device != null)
        //             {
        //                 // Prefer FCM for HTML content
        //                 if (isHtml && !string.IsNullOrEmpty(device.FCMToken))
        //                 {
        //                     return await SendHtmlViaFCMAsync(model.UserID.Value, model.Title, model.Message, model.Data);
        //                 }
        //                 model.ExpoToken = device.ExpoToken;
        //             }
        //         }

        //         // If still no token, try FCM
        //         if (string.IsNullOrEmpty(model.ExpoToken))
        //         {
        //             _logger.LogWarning("No Expo token provided or found for user {UserID}", model.UserID);
                    
        //             if (model.UserID.HasValue)
        //             {
        //                 return await _firebaseService.SendToUserAsync(model.UserID.Value, model.Title, model.Message, model.Data);
        //             }
        //             else
        //             {
        //                 return CreateFailedResult("No device token found for sending notification");
        //             }
        //         }

        //         // For Expo, convert HTML to plain text if needed
        //         var sendModel = new SendPushNotificationDTO
        //         {
        //             ExpoToken = model.ExpoToken,
        //             Title = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(model.Title, 100) : model.Title,
        //             Message = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(model.Message, 200) : model.Message,
        //             Data = model.Data,
        //             Sound = model.Sound,
        //             Priority = model.Priority,
        //             UserID = model.UserID
        //         };

        //         var expoResult = await SendExpoNotificationAsync(sendModel);
                
        //         if (expoResult.Success)
        //         {
        //             return expoResult;
        //         }
                
        //         // If Expo fails, try Firebase
        //         _logger.LogInformation("Expo failed, trying Firebase...");
                
        //         if (model.UserID.HasValue)
        //         {
        //             var firebaseResult = await _firebaseService.SendToUserAsync(model.UserID.Value, model.Title, model.Message, model.Data);
                    
        //             if (firebaseResult.Success)
        //             {
        //                 return firebaseResult;
        //             }
        //         }
                
        //         return CreateFailedResult("Both Expo and Firebase failed to send notification");
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "Error sending hybrid push notification");
        //         return CreateFailedResult(ex.Message);
        //     }
        // }

        // Services/HybridPushNotificationService.cs - Update SendPushNotificationAsync
// Services/HybridPushNotificationService.cs - Fix SendPushNotificationAsync
public async Task<PushNotificationResult> SendPushNotificationAsync(SendPushNotificationDTO model)
{
    try
    {
        // Extract notification ID from data if present
        int? notificationId = null;
        if (model.Data != null)
        {
            // Try to extract notificationId from the data object
            var dataDict = model.Data as Dictionary<string, object>;
            if (dataDict != null && dataDict.ContainsKey("notificationId"))
            {
                var idValue = dataDict["notificationId"]?.ToString();
                if (!string.IsNullOrEmpty(idValue) && int.TryParse(idValue, out int id))
                {
                    notificationId = id;
                    _logger.LogInformation("Extracted notificationId from data: {NotificationId}", notificationId);
                }
            }
        }
        
        bool isHtml = (model.Title?.Contains("<") == true && model.Title?.Contains(">") == true) ||
                     (model.Message?.Contains("<") == true && model.Message?.Contains(">") == true);

        if (model.UserID.HasValue && string.IsNullOrEmpty(model.ExpoToken))
        {
            var device = await _context.UserDevices
                .FirstOrDefaultAsync(d => d.UserID == model.UserID.Value && d.IsActive);
            
            if (device != null)
            {
                if (isHtml && !string.IsNullOrEmpty(device.FCMToken))
                {
                    return await SendHtmlViaFCMAsync(model.UserID.Value, model.Title, model.Message, model.Data, notificationId);
                }
                model.ExpoToken = device.ExpoToken;
            }
        }

        if (string.IsNullOrEmpty(model.ExpoToken))
        {
            _logger.LogWarning("No Expo token provided or found for user {UserID}", model.UserID);
            
            if (model.UserID.HasValue)
            {
                return await _firebaseService.SendToUserAsync(model.UserID.Value, model.Title, model.Message, model.Data);
            }
            else
            {
                return CreateFailedResult("No device token found for sending notification");
            }
        }

        var sendModel = new SendPushNotificationDTO
        {
            ExpoToken = model.ExpoToken,
            Title = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(model.Title, 100) : model.Title,
            Message = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(model.Message, 200) : model.Message,
            Data = model.Data,
            Sound = model.Sound,
            Priority = model.Priority,
            UserID = model.UserID
        };

        var expoResult = await SendExpoNotificationAsync(sendModel);
        
        if (expoResult.Success)
        {
            return expoResult;
        }
        
        _logger.LogInformation("Expo failed, trying Firebase...");
        
        if (model.UserID.HasValue)
        {
            var firebaseResult = await _firebaseService.SendToUserAsync(model.UserID.Value, model.Title, model.Message, model.Data);
            
            if (firebaseResult.Success)
            {
                return firebaseResult;
            }
        }
        
        return CreateFailedResult("Both Expo and Firebase failed to send notification");
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error sending hybrid push notification");
        return CreateFailedResult(ex.Message);
    }
}

        // private async Task<PushNotificationResult> SendHtmlViaFCMAsync(int userId, string titleHtml, string messageHtml, object data)
        // {
        //     try
        //     {
        //         var device = await _context.UserDevices
        //             .FirstOrDefaultAsync(d => d.UserID == userId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
                    
        //         if (device == null)
        //             return CreateFailedResult("No active FCM device found");

        //         var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
        //         var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);

        //         var dataMessage = new SendFirebaseDataMessageDTO
        //         {
        //             FCMToken = device.FCMToken,
        //             Title = titleHtml,
        //             Message = messageHtml,
        //             TitleHtml = titleHtml,
        //             MessageHtml = messageHtml,
        //             TitlePlain = titlePlain,
        //             MessagePlain = messagePlain,
        //             Data = data,
        //             Priority = "high",
        //             NotificationType = "html_notification"
        //         };

        //         return await _firebaseService.SendDataMessageAsync(dataMessage);
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "Error sending HTML via FCM");
        //         return CreateFailedResult(ex.Message);
        //     }
        // }

        // Services/HybridPushNotificationService.cs - Update SendHtmlViaFCMAsync
private async Task<PushNotificationResult> SendHtmlViaFCMAsync(int userId, string titleHtml, string messageHtml, object data, int? notificationId = null)
{
    try
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserID == userId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
            
        if (device == null)
            return CreateFailedResult("No active FCM device found");

        var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(titleHtml, 100);
        var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(messageHtml, 200);

        var dataMessage = new SendFirebaseDataMessageDTO
        {
            FCMToken = device.FCMToken,
            Title = titleHtml,
            Message = messageHtml,
            TitleHtml = titleHtml,
            MessageHtml = messageHtml,
            TitlePlain = titlePlain,
            MessagePlain = messagePlain,
            Data = data,
            Priority = "high",
            NotificationType = "html_notification",
            NotificationId = notificationId  // ADD THIS
        };

        return await _firebaseService.SendDataMessageAsync(dataMessage);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error sending HTML via FCM");
        return CreateFailedResult(ex.Message);
    }
}

        public async Task<PushNotificationResult> SendPushNotificationBatchAsync(List<SendPushNotificationDTO> models)
        {
            var result = new PushNotificationResult();
            int successCount = 0;
            int failureCount = 0;

            foreach (var model in models)
            {
                var singleResult = await SendPushNotificationAsync(model);
                
                if (singleResult.Success)
                {
                    successCount++;
                }
                else
                {
                    failureCount++;
                }
            }

            result.Success = successCount > 0;
            result.Message = $"Batch completed: {successCount} successful, {failureCount} failed";
            
            return result;
        }

        // public async Task<PushNotificationResult> SendToUserAsync(int userId, string title, string message, object data = null)
        // {
        //     try
        //     {
        //         var device = await _context.UserDevices
        //             .FirstOrDefaultAsync(d => d.UserID == userId && d.IsActive);
                    
        //         if (device == null)
        //         {
        //             return CreateFailedResult("No active device found for user");
        //         }

        //         bool isHtml = (title.Contains("<") && title.Contains(">")) || 
        //                      (message.Contains("<") && message.Contains(">"));

        //         // Try FCM first for HTML content
        //         if (isHtml && !string.IsNullOrEmpty(device.FCMToken))
        //         {
        //             var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(title, 100);
        //             var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(message, 200);

        //             var dataMessage = new SendFirebaseDataMessageDTO
        //             {
        //                 FCMToken = device.FCMToken,
        //                 Title = title,
        //                 Message = message,
        //                 TitleHtml = title,
        //                 MessageHtml = message,
        //                 TitlePlain = titlePlain,
        //                 MessagePlain = messagePlain,
        //                 Data = data,
        //                 Priority = "high",
        //                 NotificationType = "html_notification"
        //             };
                    
        //             var firebaseResult = await _firebaseService.SendDataMessageAsync(dataMessage);
                    
        //             if (firebaseResult.Success)
        //             {
        //                 return firebaseResult;
        //             }
        //         }
                
        //         // Try Expo for plain text or as fallback
        //         if (!string.IsNullOrEmpty(device.ExpoToken))
        //         {
        //             var plainTitle = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(title, 100) : title;
        //             var plainMessage = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(message, 200) : message;
                    
        //             var expoResult = await SendExpoNotificationAsync(new SendPushNotificationDTO
        //             {
        //                 ExpoToken = device.ExpoToken,
        //                 Title = plainTitle,
        //                 Message = plainMessage,
        //                 Data = data
        //             });
                    
        //             if (expoResult.Success)
        //             {
        //                 return expoResult;
        //             }
        //         }
                
        //         // Try FCM as last resort for plain text
        //         if (!string.IsNullOrEmpty(device.FCMToken))
        //         {
        //             var plainTitle = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(title, 100) : title;
        //             var plainMessage = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(message, 200) : message;
                    
        //             var firebaseResult = await _firebaseService.SendToUserAsync(userId, plainTitle, plainMessage, data);
                    
        //             if (firebaseResult.Success)
        //             {
        //                 return firebaseResult;
        //             }
        //         }
                
        //         return CreateFailedResult("No valid device tokens found for sending notification");
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "Error sending to user {UserId}", userId);
        //         return CreateFailedResult(ex.Message);
        //     }
        // }

        // Services/HybridPushNotificationService.cs - Update SendToUserAsync
// Services/HybridPushNotificationService.cs - Fix SendToUserAsync
public async Task<PushNotificationResult> SendToUserAsync(int userId, string title, string message, object data = null)
{
    try
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserID == userId && d.IsActive);
            
        if (device == null)
        {
            return CreateFailedResult("No active device found for user");
        }

        bool isHtml = (title.Contains("<") && title.Contains(">")) || 
                     (message.Contains("<") && message.Contains(">"));

        // Extract notification ID from data
        int? notificationId = null;
        if (data != null)
        {
            var dataDict = data as Dictionary<string, object>;
            if (dataDict != null && dataDict.ContainsKey("notificationId"))
            {
                var idValue = dataDict["notificationId"]?.ToString();
                if (!string.IsNullOrEmpty(idValue) && int.TryParse(idValue, out int id))
                {
                    notificationId = id;
                    _logger.LogInformation("Extracted notificationId from data in SendToUserAsync: {NotificationId}", notificationId);
                }
            }
        }

        // Try FCM first for HTML content
        if (isHtml && !string.IsNullOrEmpty(device.FCMToken))
        {
            var titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(title, 100);
            var messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(message, 200);

            var dataMessage = new SendFirebaseDataMessageDTO
            {
                FCMToken = device.FCMToken,
                Title = title,
                Message = message,
                TitleHtml = title,
                MessageHtml = message,
                TitlePlain = titlePlain,
                MessagePlain = messagePlain,
                Data = data,
                Priority = "high",
                NotificationType = "html_notification",
                NotificationId = notificationId
            };
            
            var firebaseResult = await _firebaseService.SendDataMessageAsync(dataMessage);
            
            if (firebaseResult.Success)
            {
                return firebaseResult;
            }
        }
        
        // Try Expo for plain text or as fallback
        if (!string.IsNullOrEmpty(device.ExpoToken))
        {
            var plainTitle = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(title, 100) : title;
            var plainMessage = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(message, 200) : message;
            
            var expoResult = await SendExpoNotificationAsync(new SendPushNotificationDTO
            {
                ExpoToken = device.ExpoToken,
                Title = plainTitle,
                Message = plainMessage,
                Data = data
            });
            
            if (expoResult.Success)
            {
                return expoResult;
            }
        }
        
        // Try FCM as last resort for plain text
        if (!string.IsNullOrEmpty(device.FCMToken))
        {
            var plainTitle = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(title, 100) : title;
            var plainMessage = isHtml ? HtmlToTextConverter.ConvertHtmlToPlainText(message, 200) : message;
            
            var firebaseResult = await _firebaseService.SendToUserAsync(userId, plainTitle, plainMessage, data);
            
            if (firebaseResult.Success)
            {
                return firebaseResult;
            }
        }
        
        return CreateFailedResult("No valid device tokens found for sending notification");
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error sending to user {UserId}", userId);
        return CreateFailedResult(ex.Message);
    }
}

        private async Task<PushNotificationResult> SendExpoNotificationAsync(SendPushNotificationDTO model)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("expo");
                
                var expoMessage = new
                {
                    to = model.ExpoToken,
                    title = model.Title,
                    body = model.Message,
                    data = model.Data,
                    sound = model.Sound,
                    priority = model.Priority
                };

                var json = JsonSerializer.Serialize(expoMessage);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync("send", content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    using var doc = JsonDocument.Parse(responseString);
                    var root = doc.RootElement;
                    
                    var receiptId = root.GetProperty("data").GetProperty("id").GetString();
                    
                    return new PushNotificationResult
                    {
                        Success = true,
                        Message = "Expo notification sent successfully",
                        ReceiptId = receiptId,
                        NotificationId = 0,
                        MessageId = receiptId,
                        ShouldDeactivateDevice = false
                    };
                }
                else
                {
                    _logger.LogWarning("Expo API error: {StatusCode}, Response: {Response}", 
                        response.StatusCode, responseString);
                    
                    bool shouldDeactivate = responseString.Contains("DeviceNotRegistered") || 
                                           responseString.Contains("InvalidToken") ||
                                           responseString.Contains("NotRegistered");
                    
                    return new PushNotificationResult
                    {
                        Success = false,
                        Message = $"Expo error: {responseString}",
                        ShouldDeactivateDevice = shouldDeactivate
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending Expo notification");
                return new PushNotificationResult
                {
                    Success = false,
                    Message = $"Expo error: {ex.Message}",
                    ShouldDeactivateDevice = false
                };
            }
        }

        private PushNotificationResult CreateFailedResult(string message, bool shouldDeactivate = false)
        {
            return new PushNotificationResult
            {
                Success = false,
                Message = message,
                ShouldDeactivateDevice = shouldDeactivate
            };
        }
    }
}