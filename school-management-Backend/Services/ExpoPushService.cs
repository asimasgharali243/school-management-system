using Newtonsoft.Json;
using school_management_Backend.DTOs;
using System.Text; 

namespace school_management_Backend.Services
{
    public class ExpoPushService : IPushNotificationService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ExpoPushService> _logger;
        private const string ExpoPushUrl = "https://exp.host/--/api/v2/push/send";

        public ExpoPushService(HttpClient httpClient, ILogger<ExpoPushService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<PushNotificationResult> SendPushNotificationAsync(SendPushNotificationDTO model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.ExpoToken))
                    return new PushNotificationResult { Success = false, Message = "Expo token is required" };

                var expoMessage = new
                {
                    to = model.ExpoToken,
                    title = model.Title,
                    body = model.Message,
                    data = model.Data,
                    sound = "default",
                    priority = "high",
                    channelId = "default"
                };

                var messages = new[] { expoMessage };
                var content = new StringContent(JsonConvert.SerializeObject(messages), Encoding.UTF8, "application/json");
                
                _logger.LogInformation("Sending Expo push notification to {Token}", model.ExpoToken);

                var response = await _httpClient.PostAsync(ExpoPushUrl, content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonConvert.DeserializeObject<ExpoPushResponse>(responseString);
                    
                    if (result?.Data?.FirstOrDefault()?.Status == "ok")
                    {
                        return new PushNotificationResult 
                        { 
                            Success = true, 
                            Message = "Notification sent successfully",
                            ReceiptId = result.Data.FirstOrDefault()?.Id
                        };
                    }
                    else
                    {
                        return new PushNotificationResult 
                        { 
                            Success = false, 
                            Message = result?.Data?.FirstOrDefault()?.Message ?? "Failed to send notification" 
                        };
                    }
                }

                return new PushNotificationResult 
                { 
                    Success = false, 
                    Message = $"HTTP request failed: {response.StatusCode}" 
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending Expo push notification");
                return new PushNotificationResult { Success = false, Message = ex.Message };
            }
        }

        public async Task<PushNotificationResult> SendPushNotificationBatchAsync(List<SendPushNotificationDTO> models)
        {
            try
            {
                var expoMessages = models.Select(m => new
                {
                    to = m.ExpoToken,
                    title = m.Title,
                    body = m.Message,
                    data = m.Data,
                    sound = "default",
                    priority = "high"
                }).ToList();

                var content = new StringContent(JsonConvert.SerializeObject(expoMessages), Encoding.UTF8, "application/json");
                
                _logger.LogInformation("Sending batch push notification to {Count} devices", models.Count);

                var response = await _httpClient.PostAsync(ExpoPushUrl, content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return new PushNotificationResult { Success = true, Message = "Batch notification sent" };
                }

                return new PushNotificationResult { Success = false, Message = "Batch send failed" };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending batch push notifications");
                return new PushNotificationResult { Success = false, Message = ex.Message };
            }
        }

        public async Task<PushNotificationResult> SendToUserAsync(int userId, string title, string message, object data = null)
        {
            // This method would require UserDevices context
            // Implementation depends on how you want to handle it
            throw new NotImplementedException();
        }

        private class ExpoPushResponse
        {
            public List<ExpoPushTicket> Data { get; set; }
        }

        private class ExpoPushTicket
        {
            public string Status { get; set; }
            public string Id { get; set; }
            public string Message { get; set; }
        }
    }
}