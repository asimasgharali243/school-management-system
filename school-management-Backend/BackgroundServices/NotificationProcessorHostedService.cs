using school_management_Backend.Services;
using school_management_Backend.Hangfire;
namespace school_management_Backend.BackgroundServices
{
    public class NotificationProcessorHostedService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NotificationProcessorHostedService> _logger;
        private readonly TimeSpan _processingInterval = TimeSpan.FromSeconds(30);

        public NotificationProcessorHostedService(
            IServiceProvider serviceProvider,
            ILogger<NotificationProcessorHostedService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Notification Processor Hosted Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                        var pendingNotifications = await notificationService.GetPendingNotificationsAsync();
                        
                        if (pendingNotifications.Any())
                        {
                            _logger.LogInformation("Processing {Count} pending notifications", pendingNotifications.Count);
                            await notificationService.ProcessNotificationBatchAsync(pendingNotifications);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in notification processor");
                }
                
                await Task.Delay(_processingInterval, stoppingToken);
            }

            _logger.LogInformation("Notification Processor Hosted Service is stopping.");
        }
    }
}