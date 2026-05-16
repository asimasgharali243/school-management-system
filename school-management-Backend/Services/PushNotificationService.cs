
// Services/PureFirebaseNotificationService.cs - Add Data Message Support
using System.Text.Json;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using school_management_Backend.Data;
using school_management_Backend.DTOs;

namespace school_management_Backend.Services
{
    public interface IPureFirebaseNotificationService
    {
        Task<PushNotificationResult> SendNotificationAsync(SendFirebaseNotificationDTO model);
        Task<PushNotificationResult> SendDataMessageAsync(SendFirebaseDataMessageDTO model);
        Task<PushNotificationResult> SendToUserAsync(int userId, string title, string message, object data = null);
        Task<BatchNotificationResult> SendBatchAsync(List<SendFirebaseNotificationDTO> models);
    }

    public class PureFirebaseNotificationService : IPureFirebaseNotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PureFirebaseNotificationService> _logger;
        private readonly IConfiguration _configuration;
        private bool _firebaseInitialized = false;

        public PureFirebaseNotificationService(
            ApplicationDbContext context,
            ILogger<PureFirebaseNotificationService> logger,
            IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
            InitializeFirebase();
        }

        private void InitializeFirebase()
        {
            try
            {
                if (FirebaseApp.DefaultInstance == null)
                {
                    var serviceAccountKeyPath = _configuration["Firebase:ServiceAccountKeyPath"];
                    
                    if (!string.IsNullOrEmpty(serviceAccountKeyPath) && File.Exists(serviceAccountKeyPath))
                    {
                        FirebaseApp.Create(new AppOptions()
                        {
                            Credential = GoogleCredential.FromFile(serviceAccountKeyPath),
                            ProjectId = _configuration["Firebase:ProjectId"]
                        });
                        _firebaseInitialized = true;
                        _logger.LogInformation("✅ Firebase Admin SDK initialized successfully");
                    }
                    else
                    {
                        _logger.LogWarning("⚠️ Firebase service account key not found at: {Path}", serviceAccountKeyPath);
                    }
                }
                else
                {
                    _firebaseInitialized = true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error initializing Firebase");
                _firebaseInitialized = false;
            }
        }

        public async Task<PushNotificationResult> SendNotificationAsync(SendFirebaseNotificationDTO model)
        {
            try
            {
                if (!_firebaseInitialized)
                    return CreateFailedResult("Firebase not initialized");

                if (string.IsNullOrEmpty(model.FCMToken))
                    return CreateFailedResult("FCM token is required");

                var message = new Message()
                {
                    Token = model.FCMToken,
                    Notification = new Notification()
                    {
                        Title = model.Title,
                        Body = model.Message
                    },
                    Data = ConvertToDictionary(model.Data),
                    Android = new AndroidConfig()
                    {
                        Priority = model.Priority == "high" ? Priority.High : Priority.Normal,
                        Notification = new AndroidNotification()
                        {
                            Sound = "default",
                            ChannelId = "default",
                            Icon = "ic_notification"
                        }
                    },
                    Apns = new ApnsConfig()
                    {
                        Aps = new Aps()
                        {
                            Alert = new ApsAlert()
                            {
                                Title = model.Title,
                                Body = model.Message
                            },
                            Sound = "default",
                            Badge = 1
                        }
                    }
                };

                string messageId = await FirebaseMessaging.DefaultInstance.SendAsync(message);
                _logger.LogInformation("✅ Firebase notification sent: {MessageId}", messageId);

                return CreateSuccessResult(messageId);
            }
            catch (FirebaseMessagingException ex)
            {
                _logger.LogError(ex, "❌ Firebase messaging error");
                bool shouldDeactivate = ex.MessagingErrorCode == MessagingErrorCode.Unregistered ||
                                       ex.MessagingErrorCode == MessagingErrorCode.InvalidArgument;
                return CreateFailedResult(ex.Message, shouldDeactivate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error sending Firebase notification");
                return CreateFailedResult(ex.Message);
            }
        }

        /// <summary>
        /// Send data message (supports HTML content for in-app rendering)
        /// </summary>
//        public async Task<PushNotificationResult> SendDataMessageAsync(SendFirebaseDataMessageDTO model)
// {
//     try
//     {
//         if (!_firebaseInitialized)
//             return CreateFailedResult("Firebase not initialized");

//         if (string.IsNullOrEmpty(model.FCMToken))
//             return CreateFailedResult("FCM token is required");

//         var dataDict = new Dictionary<string, string>();
        
//         string titlePlain = model.TitlePlain;
//         string messagePlain = model.MessagePlain;
        
//         if (string.IsNullOrEmpty(titlePlain) && !string.IsNullOrEmpty(model.Title))
//         {
//             titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(model.Title, 100);
//         }
        
//         if (string.IsNullOrEmpty(messagePlain) && !string.IsNullOrEmpty(model.Message))
//         {
//             messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(model.Message, 200);
//         }
        
//         if (string.IsNullOrEmpty(titlePlain)) titlePlain = "School Notification";
//         if (string.IsNullOrEmpty(messagePlain)) messagePlain = "You have a new notification";
        
//         _logger.LogInformation("📤 Sending to FCM - Title: '{Title}', Message: '{Message}'", titlePlain, messagePlain);
        
//         dataDict["title"] = titlePlain;
//         dataDict["body"] = messagePlain;
//         dataDict["click_action"] = "FLUTTER_NOTIFICATION_CLICK";
        
//         if (!string.IsNullOrEmpty(model.TitleHtml))
//             dataDict["title_html"] = model.TitleHtml;
//         if (!string.IsNullOrEmpty(model.MessageHtml))
//             dataDict["message_html"] = model.MessageHtml;
        
//         dataDict["is_html"] = "true";
//         dataDict["type"] = model.NotificationType ?? "notification";
//         dataDict["timestamp"] = DateTime.UtcNow.ToString("o");
        
//         if (model.Data != null)
//         {
//             var customData = ConvertToDictionary(model.Data);
//             foreach (var kvp in customData)
//             {
//                 if (!dataDict.ContainsKey(kvp.Key))
//                     dataDict[kvp.Key] = kvp.Value;
//             }
//         }

//         var message = new Message()
//         {
//             Token = model.FCMToken,
//             Data = dataDict,
//             Android = new AndroidConfig()
//             {
//                 Priority = model.Priority == "high" ? Priority.High : Priority.Normal,
//                 Notification = new AndroidNotification()
//                 {
//                     Title = titlePlain,
//                     Body = messagePlain,
//                     Sound = "default",
//                     ChannelId = "html_notifications",
//                     ClickAction = "FLUTTER_NOTIFICATION_CLICK"
//                 }
//             },
//             Apns = new ApnsConfig()
//             {
//                 Aps = new Aps()
//                 {
//                     Alert = new ApsAlert()
//                     {
//                         Title = titlePlain,
//                         Body = messagePlain
//                     },
//                     Sound = "default",
//                     Badge = 1,
//                     ContentAvailable = true
//                 },
//                 Headers = new Dictionary<string, string>()
//                 {
//                     { "apns-priority", "10" }
//                 }
//             }
//         };

//         string messageId = await FirebaseMessaging.DefaultInstance.SendAsync(message);
//         _logger.LogInformation("✅ Firebase notification sent with title: '{Title}'", titlePlain);

//         return CreateSuccessResult(messageId);
//     }
//     catch (FirebaseMessagingException ex)
//     {
//         _logger.LogError(ex, "❌ Firebase messaging error");
//         bool shouldDeactivate = ex.MessagingErrorCode == MessagingErrorCode.Unregistered ||
//                                ex.MessagingErrorCode == MessagingErrorCode.InvalidArgument;
//         return CreateFailedResult(ex.Message, shouldDeactivate);
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError(ex, "❌ Error sending Firebase data message");
//         return CreateFailedResult(ex.Message);
//     }
// }


// Services/PureFirebaseNotificationService.cs - Update SendDataMessageAsync
public async Task<PushNotificationResult> SendDataMessageAsync(SendFirebaseDataMessageDTO model)
{
    try
    {
        if (!_firebaseInitialized)
            return CreateFailedResult("Firebase not initialized");

        if (string.IsNullOrEmpty(model.FCMToken))
            return CreateFailedResult("FCM token is required");

        var dataDict = new Dictionary<string, string>();
        
        string titlePlain = model.TitlePlain;
        string messagePlain = model.MessagePlain;
        
        if (string.IsNullOrEmpty(titlePlain) && !string.IsNullOrEmpty(model.Title))
        {
            titlePlain = HtmlToTextConverter.ConvertHtmlToPlainText(model.Title, 100);
        }
        
        if (string.IsNullOrEmpty(messagePlain) && !string.IsNullOrEmpty(model.Message))
        {
            messagePlain = HtmlToTextConverter.ConvertHtmlToPlainText(model.Message, 200);
        }
        
        if (string.IsNullOrEmpty(titlePlain)) titlePlain = "School Notification";
        if (string.IsNullOrEmpty(messagePlain)) messagePlain = "You have a new notification";
        
        _logger.LogInformation("📤 Sending to FCM - Title: '{Title}', Message: '{Message}'", titlePlain, messagePlain);
        
        dataDict["title"] = titlePlain;
        dataDict["body"] = messagePlain;
        dataDict["click_action"] = "FLUTTER_NOTIFICATION_CLICK";
        
        if (!string.IsNullOrEmpty(model.TitleHtml))
            dataDict["title_html"] = model.TitleHtml;
        if (!string.IsNullOrEmpty(model.MessageHtml))
            dataDict["message_html"] = model.MessageHtml;
        
        dataDict["is_html"] = "true";
        dataDict["type"] = model.NotificationType ?? "notification";
        dataDict["timestamp"] = DateTime.UtcNow.ToString("o");
        
        // ADD NOTIFICATION ID TO PAYLOAD
        if (model.NotificationId.HasValue)
        {
            dataDict["notificationId"] = model.NotificationId.Value.ToString();
            dataDict["queueID"] = model.NotificationId.Value.ToString();
        }
        
        if (model.Data != null)
        {
            var customData = ConvertToDictionary(model.Data);
            foreach (var kvp in customData)
            {
                if (!dataDict.ContainsKey(kvp.Key))
                    dataDict[kvp.Key] = kvp.Value;
            }
        }

        var message = new Message()
        {
            Token = model.FCMToken,
            Data = dataDict,
            Android = new AndroidConfig()
            {
                Priority = model.Priority == "high" ? Priority.High : Priority.Normal,
                Notification = new AndroidNotification()
                {
                    Title = titlePlain,
                    Body = messagePlain,
                    Sound = "default",
                    ChannelId = "html_notifications",
                    ClickAction = "FLUTTER_NOTIFICATION_CLICK"
                }
            },
            Apns = new ApnsConfig()
            {
                Aps = new Aps()
                {
                    Alert = new ApsAlert()
                    {
                        Title = titlePlain,
                        Body = messagePlain
                    },
                    Sound = "default",
                    Badge = 1,
                    ContentAvailable = true
                },
                Headers = new Dictionary<string, string>()
                {
                    { "apns-priority", "10" }
                }
            }
        };

        string messageId = await FirebaseMessaging.DefaultInstance.SendAsync(message);
        _logger.LogInformation("✅ Firebase notification sent with ID: {NotificationId}", model.NotificationId);

        return CreateSuccessResult(messageId);
    }
    catch (FirebaseMessagingException ex)
    {
        _logger.LogError(ex, "❌ Firebase messaging error");
        bool shouldDeactivate = ex.MessagingErrorCode == MessagingErrorCode.Unregistered ||
                               ex.MessagingErrorCode == MessagingErrorCode.InvalidArgument;
        return CreateFailedResult(ex.Message, shouldDeactivate);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "❌ Error sending Firebase data message");
        return CreateFailedResult(ex.Message);
    }
}

        public async Task<PushNotificationResult> SendToUserAsync(int userId, string title, string message, object data = null)
        {
            try
            {
                var device = await _context.UserDevices
                    .FirstOrDefaultAsync(d => d.UserID == userId && d.IsActive && !string.IsNullOrEmpty(d.FCMToken));
                    
                if (device == null)
                    return CreateFailedResult("No active device with FCM token found");

                // Check if this is HTML content
                bool isHtml = (title.Contains("<") && title.Contains(">")) || 
                             (message.Contains("<") && message.Contains(">"));
                
                if (isHtml)
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
                        NotificationType = "html_notification"
                    };
                    return await SendDataMessageAsync(dataMessage);
                }
                else
                {
                    var notification = new SendFirebaseNotificationDTO
                    {
                        FCMToken = device.FCMToken,
                        Title = title,
                        Message = message,
                        Data = data,
                        Priority = "high"
                    };
                    return await SendNotificationAsync(notification);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error sending to user {UserId}", userId);
                return CreateFailedResult(ex.Message);
            }
        }

        public async Task<BatchNotificationResult> SendBatchAsync(List<SendFirebaseNotificationDTO> models)
        {
            var result = new BatchNotificationResult();
            
            try
            {
                if (!_firebaseInitialized)
                    throw new InvalidOperationException("Firebase not initialized");

                var messages = models
                    .Where(m => !string.IsNullOrEmpty(m.FCMToken))
                    .Select(CreateFirebaseMessage)
                    .ToList();

                if (!messages.Any())
                {
                    _logger.LogWarning("No valid FCM tokens in batch");
                    return result;
                }

                var batchResponse = await FirebaseMessaging.DefaultInstance.SendEachAsync(messages);

                result.SuccessCount = batchResponse.SuccessCount;
                result.FailureCount = batchResponse.FailureCount;
                
                _logger.LogInformation("✅ Firebase batch sent: {Success}/{Total}",
                    batchResponse.SuccessCount, messages.Count);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error sending Firebase batch");
                throw;
            }
        }

        private Message CreateFirebaseMessage(SendFirebaseNotificationDTO model)
        {
            return new Message()
            {
                Token = model.FCMToken,
                Notification = new Notification()
                {
                    Title = model.Title,
                    Body = model.Message
                },
                Data = ConvertToDictionary(model.Data),
                Android = new AndroidConfig()
                {
                    Priority = model.Priority == "high" ? Priority.High : Priority.Normal,
                    Notification = new AndroidNotification()
                    {
                        Sound = "default",
                        ChannelId = "default",
                        Icon = "ic_notification",
                        Tag = model.Tag ?? "school_notification",
                        Color = "#4A90E2"
                    }
                },
                Apns = new ApnsConfig()
                {
                    Aps = new Aps()
                    {
                        Alert = new ApsAlert()
                        {
                            Title = model.Title,
                            Body = model.Message
                        },
                        Sound = "default",
                        Badge = 1
                    },
                    Headers = new Dictionary<string, string>()
                    {
                        { "apns-priority", "10" }
                    }
                }
            };
        }

        private Dictionary<string, string> ConvertToDictionary(object data)
        {
            var dict = new Dictionary<string, string>();
            if (data == null) return dict;

            try
            {
                var json = JsonSerializer.Serialize(data);
                using var doc = JsonDocument.Parse(json);
                
                foreach (var prop in doc.RootElement.EnumerateObject())
                {
                    dict[prop.Name] = prop.Value.ToString();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error converting data to dictionary");
            }

            return dict;
        }

        private PushNotificationResult CreateSuccessResult(string messageId = null)
        {
            return new PushNotificationResult
            {
                Success = true,
                Message = "Firebase notification sent successfully",
                MessageId = messageId,
                ShouldDeactivateDevice = false
            };
        }

        private PushNotificationResult CreateFailedResult(string error, bool shouldDeactivate = false)
        {
            return new PushNotificationResult
            {
                Success = false,
                Message = error,
                ShouldDeactivateDevice = shouldDeactivate
            };
        }
    }

    // New DTO for Data Messages
    public class SendFirebaseDataMessageDTO
    {
        public string FCMToken { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string TitleHtml { get; set; } = string.Empty;
        public string MessageHtml { get; set; } = string.Empty;
        public string TitlePlain { get; set; } = string.Empty;
        public string MessagePlain { get; set; } = string.Empty;
        public object Data { get; set; } = null!;
        public string Priority { get; set; } = "high";
        public string NotificationType { get; set; } = "notification";
          public int? NotificationId { get; set; }  // ADD THIS
    public int? QueueId { get; set; }  // ADD THIS
    }
}