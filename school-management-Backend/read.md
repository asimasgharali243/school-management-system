{
  "Logging": {
    "LogLevel": {
      "Microsoft.AspNetCore": "Warning",
      "Hangfire": "Warning",
      "Default": "Debug",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information",
      "school_management_Backend.Controllers": "Debug"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=213.175.201.128;Database=ultsolrgs;User Id=ultsolrgs_user;Password=UltSol@123;TrustServerCertificate=true;Encrypt=False;MultipleActiveResultSets=true;Max Pool Size=100;Pooling=true;Connection Timeout=60"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyHereThatIsAtLeast32CharactersLong",
    "Issuer": "Backend",
    "Audience": "BackendUsers",
    "ExpireHours": 168
  },
  "Firebase": {
    "ProjectId": "schoolmanagementapp-2d09e",
    "ServiceAccountKeyPath": "Firebase/schoolmanagementapp-2d09e-firebase-adminsdk-fbsvc-cad79bca70.json"
  
  
  
  },
  "NotificationSettings": {
    "ProcessingIntervalSeconds": 30,
    "MaxRetryAttempts": 3,
    "ExpiryDays": 7,
    "BatchSize": 100
  },
  "AllowedHosts": "*"
}