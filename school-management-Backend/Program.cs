
// Program.cs

using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using System.Security.Claims;
using school_management_Backend.Services;
using school_management_Backend.BackgroundServices;
using Hangfire;
using Hangfire.SqlServer;
using school_management_Backend.Hangfire;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using System.IO;
using school_management_Backend;

var builder = WebApplication.CreateBuilder(args);

// Load configuration
var configuration = builder.Configuration;

// Initialize Firebase
try
{
    // Get the path from configuration
    var serviceAccountKeyPath = configuration["Firebase:ServiceAccountKeyPath"];
    var projectId = configuration["Firebase:ProjectId"];
    
    Console.WriteLine($"🔥 Firebase Configuration:");
    Console.WriteLine($"   ProjectId: {projectId}");
    Console.WriteLine($"   ServiceAccountKeyPath from config: {serviceAccountKeyPath}");
    
    if (!string.IsNullOrEmpty(serviceAccountKeyPath))
    {
        // Try to resolve the full path
        string firebaseConfigPath;
        
        // If it's already a full path
        if (Path.IsPathRooted(serviceAccountKeyPath))
        {
            firebaseConfigPath = serviceAccountKeyPath;
        }
        else
        {
            // Combine with content root path
            firebaseConfigPath = Path.Combine(builder.Environment.ContentRootPath, serviceAccountKeyPath);
        }
        
        Console.WriteLine($"🔥 Resolved Firebase config path: {firebaseConfigPath}");
        Console.WriteLine($"🔥 File exists: {File.Exists(firebaseConfigPath)}");
        Console.WriteLine($"🔥 Content Root Path: {builder.Environment.ContentRootPath}");
        
        // Debug: List files in the Firebase directory
        var firebaseDir = Path.GetDirectoryName(firebaseConfigPath);
        if (Directory.Exists(firebaseDir))
        {
            Console.WriteLine($"🔥 Files in Firebase directory:");
            foreach (var file in Directory.GetFiles(firebaseDir))
            {
                Console.WriteLine($"   - {Path.GetFileName(file)}");
            }
        }
        
        if (File.Exists(firebaseConfigPath))
        {
            // Read the JSON file to verify it's valid
            var jsonContent = File.ReadAllText(firebaseConfigPath);
            Console.WriteLine($"🔥 Firebase config file size: {jsonContent.Length} bytes");
            
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(firebaseConfigPath),
                ProjectId = projectId
            });
            
            Console.WriteLine("✅ Firebase initialized successfully");
            
            // Verify Firebase app
            var defaultApp = FirebaseApp.DefaultInstance;
            if (defaultApp != null)
            {
                Console.WriteLine($"✅ Firebase App Name: {defaultApp.Name}");
                Console.WriteLine($"✅ Firebase App ProjectId: {projectId}");
            }
        }
        else
        {
            Console.WriteLine("⚠️ Firebase config file not found at the specified path");
            
            // Try alternative paths as fallback
            Console.WriteLine("🔄 Trying alternative locations...");
            
            var alternativePaths = new[]
            {
                Path.Combine(Directory.GetCurrentDirectory(), serviceAccountKeyPath),
                Path.Combine(AppDomain.CurrentDomain.BaseDirectory, serviceAccountKeyPath),
                Path.Combine(Directory.GetCurrentDirectory(), "Firebase", "schoolmanagementapp-2d09e-firebase-adminsdk-fbsvc-cad79bca70.json"),
                Path.Combine(builder.Environment.ContentRootPath, "Firebase", "schoolmanagementapp-2d09e-firebase-adminsdk-fbsvc-cad79bca70.json")
            };
            
            bool found = false;
            foreach (var altPath in alternativePaths)
            {
                Console.WriteLine($"   Checking: {altPath}");
                if (File.Exists(altPath))
                {
                    Console.WriteLine($"✅ Found at alternative path: {altPath}");
                    FirebaseApp.Create(new AppOptions()
                    {
                        Credential = GoogleCredential.FromFile(altPath),
                        ProjectId = projectId
                    });
                    Console.WriteLine("✅ Firebase initialized from alternative path");
                    found = true;
                    break;
                }
            }
            
            if (!found)
            {
                Console.WriteLine("⚠️ Firebase config file not found in any location, notifications will use Expo only");
            }
        }
    }
    else
    {
        Console.WriteLine("⚠️ Firebase:ServiceAccountKeyPath not configured in appsettings.json");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Firebase initialization failed: {ex.Message}");
    Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
    
    // Check if it's a specific JSON parsing error
    if (ex.Message.Contains("JSON"))
    {
        Console.WriteLine("🔍 This appears to be a JSON parsing error. Please verify the Firebase JSON file is valid.");
    }
}

// Add services to the container
// Replace your current CORS configuration with this:
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy => policy
            .WithOrigins("https://notify.ultsol.cloud", "http://localhost:3000", "https://localhost:3000","http://localhost:5027",
            // 
            
            "exp://",
                "http://localhost:8081",  // Metro bundler
                "http://10.0.2.2:8081",   // Android emulator
                "http://localhost:19000", // Expo default
                "http://localhost:19001", // Expo fallback
                "http://localhost:19002", // Expo dev tools
                "exp://192.168.x.x:19000"
            
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()); // Important for JWT tokens
});

// Add HttpClient
builder.Services.AddHttpClient("expo", client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.BaseAddress = new Uri("https://exp.host/--/api/v2/push/");
});

// Configure JWT Authentication
var jwtSecret = configuration["Jwt:Secret"] ?? 
                "YourSuperSecretKeyHereThatIsAtLeast32CharactersLong12345";
var jwtIssuer = configuration["Jwt:Issuer"] ?? "Backend";
var jwtAudience = configuration["Jwt:Audience"] ?? "BackendUsers";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Add controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


// Register Notification Settings from configuration
builder.Services.Configure<NotificationSettings>(configuration.GetSection("NotificationSettings"));

// Hangfire
builder.Services.AddHangfire(config =>
    config.UseSqlServerStorage(configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHangfireServer();

// Register Services
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IPushNotificationService, HybridPushNotificationService>();
builder.Services.AddScoped<INotificationRuleProcessor, NotificationRuleProcessor>();
builder.Services.AddScoped<IBackgroundNotificationService, BackgroundNotificationService>(); // FIXED: Using interface
// Add this registration
builder.Services.AddScoped<IPureFirebaseNotificationService, PureFirebaseNotificationService>();


// Background Services
builder.Services.AddHostedService<NotificationProcessorHostedService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "School Management API",
        Version = "v1",
        Description = "API for School Management System with Firebase/Expo Notifications"
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
// app.UseCors("AllowAll");
app.UseCors("AllowSpecificOrigin"); // Change from "AllowAll" to your policy name

app.UseAuthentication();
app.UseAuthorization();

// Hangfire Dashboard
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter() }
});

// Schedule recurring jobs - CORRECTED: Using IBackgroundNotificationService interface
RecurringJob.AddOrUpdate<IBackgroundNotificationService>(
    "process-scheduled",
    service => service.ProcessScheduledNotificationsAsync(),
    "*/5 * * * *" // Every 5 minutes
);

RecurringJob.AddOrUpdate<IBackgroundNotificationService>(
    "check-events",
    service => service.CheckEventRulesAsync(),
    "*/2 * * * *" // Every 2 minutes
);

RecurringJob.AddOrUpdate<IBackgroundNotificationService>(
    "cleanup-old-data",
    service => service.CleanupOldDataAsync(),
    "0 2 * * *" // Daily at 2 AM
);

RecurringJob.AddOrUpdate<IBackgroundNotificationService>(
    "retry-failed",
    service => service.RetryFailedNotificationsAsync(),
    "*/30 * * * *" // Every 30 minutes
);

RecurringJob.AddOrUpdate<IBackgroundNotificationService>(
    "process-expired",
    service => service.ProcessExpiredNotificationsAsync(),
    "*/15 * * * *" // Every 15 minutes
);

app.MapControllers();

// Health check
app.MapGet("/", () => "Notification API is running!");
app.MapGet("/health", () => new 
{ 
    Status = "Healthy", 
    Time = DateTime.UtcNow,
    Firebase = FirebaseApp.DefaultInstance != null ? "Active" : "Not Active",
    Database = "Connected",
    FirebaseConfigPath = configuration["Firebase:ServiceAccountKeyPath"]
});

// Add a debug endpoint to check file paths
app.MapGet("/debug/firebase-paths", () =>
{
    var paths = new
    {
        ContentRootPath = builder.Environment.ContentRootPath,
        CurrentDirectory = Directory.GetCurrentDirectory(),
        BaseDirectory = AppDomain.CurrentDomain.BaseDirectory,
        ConfigPathFromSettings = configuration["Firebase:ServiceAccountKeyPath"],
        ResolvedPath = Path.Combine(builder.Environment.ContentRootPath, configuration["Firebase:ServiceAccountKeyPath"]),
        FileExists = File.Exists(Path.Combine(builder.Environment.ContentRootPath, configuration["Firebase:ServiceAccountKeyPath"]))
    };
    
    return Results.Json(paths);
});

app.Run();

// Create a class for NotificationSettings if it doesn't exist
public class NotificationSettings
{
    public int ProcessingIntervalSeconds { get; set; }
    public int MaxRetryAttempts { get; set; }
    public int ExpiryDays { get; set; }
    public int BatchSize { get; set; }
}