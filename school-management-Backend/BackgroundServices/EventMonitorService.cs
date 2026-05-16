using school_management_Backend.Services;
using school_management_Backend.Hangfire;
namespace school_management_Backend.BackgroundServices
{
    public class EventMonitorService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<EventMonitorService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(2);

        public EventMonitorService(
            IServiceProvider serviceProvider,
            ILogger<EventMonitorService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Event Monitor Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var backgroundService = scope.ServiceProvider.GetRequiredService<IBackgroundNotificationService>();
                        await backgroundService.CheckEventRulesAsync();
                        await backgroundService.ProcessExpiredNotificationsAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in event monitor service");
                }
                
                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("Event Monitor Service is stopping.");
        }
    }
}