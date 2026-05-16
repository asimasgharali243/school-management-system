{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.AspNetCore.Authentication": "Warning",
      "Microsoft.AspNetCore.Authorization": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=213.175.201.128;Database=ultsolrgs;User Id=ultsolrgs_user;Password=UltSol@123;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyHereThatIsAtLeast32CharactersLong",
    "Issuer": "Backend",
    "Audience": "BackendUsers",
    "ExpireHours": 168
  },
  "FCM": {
    "ServiceAccountKeyPath": "Firebase/schoolmanagementapp-2d09e-firebase-adminsdk-fbsvc-cad79bca70.json",
    "SenderId": "1069955558125"
  },
  "NotificationSettings": {
    "ProcessingIntervalSeconds": 30,
    "ScheduledCheckIntervalMinutes": 5,
    "EventCheckIntervalMinutes": 2,
    "CleanupDays": 90,
    "MaxRetryAttempts": 3,
    "ExpiryDays": 7
  },
  "Expo": {
    "PushUrl": "https://exp.host/--/api/v2/push/send",
    "ApiKey": ""
  },
  "AllowedHosts": "*"
}