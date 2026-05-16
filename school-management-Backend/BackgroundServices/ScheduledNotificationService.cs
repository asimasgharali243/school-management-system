using school_management_Backend.Services;
using school_management_Backend.Hangfire;
namespace school_management_Backend.BackgroundServices
{
    public class ScheduledNotificationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ScheduledNotificationService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5);

        public ScheduledNotificationService(
            IServiceProvider serviceProvider,
            ILogger<ScheduledNotificationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Scheduled Notification Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var backgroundService = scope.ServiceProvider.GetRequiredService<IBackgroundNotificationService>();
                        await backgroundService.ProcessScheduledNotificationsAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in scheduled notification service");
                }
                
                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("Scheduled Notification Service is stopping.");
        }
    }
}