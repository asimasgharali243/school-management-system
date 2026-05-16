using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using school_management_Backend.Data;
using school_management_Backend.DTOs;
using school_management_Backend.Models;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        // Helper method for encoding
        public static string Encode(string str)
        {
            byte[] bt = Encoding.ASCII.GetBytes(str);
            string str2 = Convert.ToBase64String(bt);
            byte[] bt2 = Encoding.ASCII.GetBytes(str2);
            return Convert.ToBase64String(bt2);
        }

        // Helper method for decoding
        public static string Decode(string encodedStr)
        {
            try
            {
                byte[] bt = Convert.FromBase64String(encodedStr);
                string str1 = Encoding.ASCII.GetString(bt);
                byte[] bt2 = Convert.FromBase64String(str1);
                return Encoding.ASCII.GetString(bt2);
            }
            catch
            {
                return null;
            }
        }

//         // POST: api/Auth/login
//         [HttpPost("login")]
//         public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
//         {
//             try
//             {
//                 _logger.LogInformation("Login attempt for username: {Username}", request.Username);

//                 // Find user by username (case insensitive) and check status
//                 var user = await _context.tbl_User
//                     .Include(u => u.Role)
//                     .Include(u => u.Campus)
//                     .FirstOrDefaultAsync(u => 
//                         u.UserName.ToLower() == request.Username.ToLower() && 
//                         u.Status == true);

//                 if (user == null)
//                 {
//                     _logger.LogWarning("User not found: {Username}", request.Username);
//                     return Unauthorized(new { message = "Invalid username or password" });
//                 }

//                 _logger.LogInformation("User found: ID={UserId}, Name={UserName}", user.ID, user.UserName);

//                 // Check password
//                 bool passwordValid = CheckPassword(user.Password, request.Password);
                
//                 if (!passwordValid)
//                 {
//                     _logger.LogWarning("Invalid password for user: {Username}", request.Username);
//                     return Unauthorized(new { message = "Invalid username or password" });
//                 }

//                 // Generate JWT token
//                 var token = GenerateJwtToken(user);
//                 _logger.LogInformation("Token generated for user: {UserId}", user.ID);

//                 // Get user permissions based on role
//                 var permissions = GetUserPermissions(user.RoleID ?? 0);

//                 // Create UserDto
//                 var userDto = new UserDto
//                 {
//                     Id = user.ID,
//                     Name = user.Name != null ? user.Name : user.UserName,
//                     UserName = user.UserName,
//                     Designation = user.Designation != null ? user.Designation : string.Empty,
//                     RoleID = user.RoleID,
//                     RoleName = user.Role != null ? user.Role.Role : string.Empty,
//                     CampusID = user.CampusID,
//                     CampusName = user.Campus != null ? user.Campus.CampusName : string.Empty,
//                     UserImage = user.UserImage != null ? user.UserImage : string.Empty,
//                     FamilyID = user.FamilyID,
//                     Permissions = permissions
//                 };

//                 // Get children for parent users
//                 List<StudentDto> children = new List<StudentDto>();
//                 if (user.RoleID == 4 && user.FamilyID.HasValue)
//                 {
//                     children = await _context.tbl_StudentRegistration
//                         .Where(s => s.Family_Code == user.FamilyID && s.cur_Status == "A")
//                         .Include(s => s.Class)
//                         .Include(s => s.Section)
//                         .Include(s => s.Campus)
//                         .Select(s => new StudentDto
//                         {
//                             Reg_Id = s.Reg_Id,
//                             Reg_No = s.Reg_No,
//                             Name = s.Frist_Name != null ? s.Frist_Name : string.Empty,
//                             Image = s.Image != null ? s.Image : string.Empty,
//                             Gender = s.Gender != null ? s.Gender : string.Empty,
//                             Class_ID = s.Class_ID,
//                             ClassName = s.Class != null ? s.Class.Class_Name : string.Empty,
//                             Section_ID = s.Section_ID,
//                             SectionName = s.Section != null ? s.Section.Section : string.Empty,
//                             RollNo = s.RollNo != null ? s.RollNo.ToString() : string.Empty,
//                             Family_Code = s.Family_Code,
//                             CampusName = s.Campus != null ? s.Campus.CampusName : string.Empty,
//                             Status = s.cur_Status != null ? s.cur_Status : string.Empty
//                         })
//                         .ToListAsync();
// foreach (var child in children)
// {
//     child.DiaryAccess = await GetDiaryAccess(child.Reg_Id);
// }

//                 }

//                 // Create response
//                 var response = new AuthResponse
//                 {
//                     Token = token,
//                     User = userDto,
//                     Children = children
//                 };

//                 _logger.LogInformation("Login successful for user: {Username}", request.Username);
//                 return Ok(response);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error during login for username: {Username}", request.Username);
//                 return StatusCode(500, new { message = "Internal server error", error = ex.Message });
//             }
//         }


// private async Task<int> GetDiaryAccess(int regId)
// {
//     // 1. Check unpaid months exist
//     var hasUnpaid = await (
//         from p in _context.tbl_FeePosting
//         where p.Reg_ID == regId
//         where !_context.tbl_FeeReceiveMaster
//             .Where(m => m.RegID == regId)
//             .Join(_context.tbl_FeeReceiveDetail,
//                 m => m.Receipt_ID,
//                 d => d.Receipt_ID,
//                 (m, d) => new { m, d })
//             .Any(x =>
//                 x.d.FeeMonth == p.FeeMonth &&
//                 x.d.FeeYear == p.FeeYear
//             )
//         select p
//     ).AnyAsync();

//     // 2. Check temporary access
//     var tempAccess = await _context.tbl_DiaryAccessControl
//         .AnyAsync(x =>
//             x.RegID == regId &&
//             x.IsActive &&
//             DateTime.Now >= x.AllowFrom &&
//             DateTime.Now <= x.AllowTo
//         );

//     // 3. FINAL RULE
//     return (hasUnpaid || tempAccess) ? 1 : 0;
// }



[HttpPost("login")]
public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
{
    try
    {
        _logger.LogInformation("Login attempt for username: {Username}", request.Username);

        // =========================
        // 1. GET USER
        // =========================
        var user = await _context.tbl_User
            .Include(u => u.Role)
            .Include(u => u.Campus)
            .FirstOrDefaultAsync(u =>
                u.UserName.ToLower() == request.Username.ToLower() &&
                u.Status == true);

        if (user == null)
            return Unauthorized(new { message = "Invalid username or password" });

        // =========================
        // 2. CHECK PASSWORD
        // =========================
        bool passwordValid = CheckPassword(user.Password, request.Password);

        if (!passwordValid)
            return Unauthorized(new { message = "Invalid username or password" });

        // =========================
        // 3. JWT TOKEN
        // =========================
        var token = GenerateJwtToken(user);

        var permissions = GetUserPermissions(user.RoleID ?? 0);

        var userDto = new UserDto
        {
            Id = user.ID,
            Name = user.Name ?? user.UserName,
            UserName = user.UserName,
            Designation = user.Designation ?? "",
            RoleID = user.RoleID,
            RoleName = user.Role?.Role ?? "",
            CampusID = user.CampusID,
            CampusName = user.Campus?.CampusName ?? "",
            UserImage = user.UserImage ?? "",
            FamilyID = user.FamilyID,
            Permissions = permissions
        };

        // =========================
        // 4. CHILDREN (ONLY FOR PARENT)
        // =========================
        List<StudentDto> children = new();

        if (user.RoleID == 4 && user.FamilyID.HasValue)
        {
            children = await _context.tbl_StudentRegistration
                .Where(s => s.Family_Code == user.FamilyID && s.cur_Status == "A")
                .Include(s => s.Class)
                .Include(s => s.Section)
                .Include(s => s.Campus)
                .Select(s => new StudentDto
                {
                    Reg_Id = s.Reg_Id,
                    Reg_No = s.Reg_No,
                    Name = s.Frist_Name ?? "",
                    Image = s.Image ?? "",
                    Gender = s.Gender ?? "",
                    Class_ID = s.Class_ID,
                    ClassName = s.Class.Class_Name,
                    Section_ID = s.Section_ID,
                    SectionName = s.Section.Section,
                    RollNo = s.RollNo.HasValue ? s.RollNo.Value.ToString() : "",
                    Family_Code = s.Family_Code,
                    CampusName = s.Campus.CampusName,
                    Status = s.cur_Status,
                    DiaryAccess = 0
                })
                .ToListAsync();

            // =========================
            // 5. BULK DIARY ACCESS LOGIC (FAST)
            // =========================
            var regIds = children.Select(x => x.Reg_Id).ToList();
            var now = DateTime.Now;

            // TEMP ACCESS
            var tempAccessIds = await _context.tbl_DiaryAccessControl
                .Where(x =>
                    regIds.Contains(x.RegID) &&
                    x.IsActive &&
                    now >= x.AllowFrom &&
                    now <= x.AllowTo
                )
                .Select(x => x.RegID)
                .Distinct()
                .ToListAsync();

            // UNPAID CHECK
            var unpaidIds = await (
                from p in _context.tbl_FeePosting
                where regIds.Contains((int)p.Reg_ID)

                where !_context.tbl_FeeReceiveMaster
                    .Where(m => m.RegID == p.Reg_ID)
                    .Join(_context.tbl_FeeReceiveDetail,
                        m => m.Receipt_ID,
                        d => d.Receipt_ID,
                        (m, d) => new { m, d })
                    .Any(x =>
                        x.d.FeeMonth == p.FeeMonth &&
                        x.d.FeeYear == p.FeeYear
                    )

                select p.Reg_ID
            )
            .Distinct()
            .ToListAsync();

            // =========================
            // 6. APPLY SAME BUSINESS RULE
            // =========================
            foreach (var child in children)
            {
                bool hasUnpaid = unpaidIds.Contains(child.Reg_Id);
                bool hasTempAccess = tempAccessIds.Contains(child.Reg_Id);

                // FINAL RULE (same as Children API)
              child.DiaryAccess = hasTempAccess ? 1 : (hasUnpaid ? 0 : 1);
            }
        }

        // =========================
        // 7. RESPONSE
        // =========================
        var response = new AuthResponse
        {
            Token = token,
            User = userDto,
            Children = children
        };

        _logger.LogInformation("Login successful for user: {Username}", request.Username);

        return Ok(response);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error during login");
        return StatusCode(500, new { message = "Internal server error", error = ex.Message });
    }
}

        private bool CheckPassword(string storedPassword, string inputPassword)
        {
            try
            {
                if (string.IsNullOrEmpty(storedPassword))
                    return false;

                // Try double base64 decode
                try
                {
                    string decodedDbPassword = Decode(storedPassword);
                    if (decodedDbPassword == inputPassword)
                    {
                        _logger.LogDebug("Password validated using double base64 decode");
                        return true;
                    }
                }
                catch { }

                // Try single base64 decode
                try
                {
                    byte[] decodedBytes = Convert.FromBase64String(storedPassword);
                    string decodedPassword = Encoding.UTF8.GetString(decodedBytes);
                    
                    if (decodedPassword == inputPassword)
                    {
                        _logger.LogDebug("Password validated using single base64 decode");
                        return true;
                    }
                }
                catch { }

                // Try direct comparison
                if (storedPassword == inputPassword)
                {
                    _logger.LogDebug("Password validated using direct comparison");
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking password");
                return false;
            }
        }

        // POST: api/Auth/logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId.HasValue)
                {
                    // You can update user login status here if needed
                }
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Logout failed");
                return StatusCode(500, new { message = "Logout failed", error = ex.Message });
            }
        }

        // GET: api/Auth/validate
        [HttpGet("validate")]
        public async Task<ActionResult<AuthResponse>> ValidateToken()
        {
            try
            {
                var userId = GetUserIdFromToken();
                _logger.LogInformation("Token validation request. UserId from token: {UserId}", userId);

                if (!userId.HasValue)
                {
                    _logger.LogWarning("Token validation failed: No user ID found in token");
                    return Unauthorized(new { message = "Invalid token" });
                }

                var user = await _context.tbl_User
                    .Include(u => u.Role)
                    .Include(u => u.Campus)
                    .FirstOrDefaultAsync(u => u.ID == userId && u.Status == true);

                if (user == null)
                {
                    _logger.LogWarning("Token validation failed: User not found in database. UserId: {UserId}", userId);
                    return Unauthorized(new { message = "User not found" });
                }

                var permissions = GetUserPermissions(user.RoleID ?? 0);

                var userDto = new UserDto
                {
                    Id = user.ID,
                    Name = user.Name != null ? user.Name : user.UserName,
                    UserName = user.UserName,
                    Designation = user.Designation != null ? user.Designation : string.Empty,
                    RoleID = user.RoleID,
                    RoleName = user.Role != null ? user.Role.Role : string.Empty,
                    CampusID = user.CampusID,
                    CampusName = user.Campus != null ? user.Campus.CampusName : string.Empty,
                    UserImage = user.UserImage != null ? user.UserImage : string.Empty,
                    FamilyID = user.FamilyID,
                    Permissions = permissions
                };

                // Get children for parent users
                List<StudentDto> children = new List<StudentDto>();
                if (user.RoleID == 4 && user.FamilyID.HasValue)
                {
                    children = await _context.tbl_StudentRegistration
                        .Where(s => s.Family_Code == user.FamilyID && s.cur_Status == "A")
                        .Include(s => s.Class)
                        .Include(s => s.Section)
                        .Include(s => s.Campus)
                        .Select(s => new StudentDto
                        {
                            Reg_Id = s.Reg_Id,
                            Reg_No = s.Reg_No,
                            Name = s.Frist_Name != null ? s.Frist_Name : string.Empty,
                            Image = s.Image != null ? s.Image : string.Empty,
                            Gender = s.Gender != null ? s.Gender : string.Empty,
                            Class_ID = s.Class_ID,
                            ClassName = s.Class != null ? s.Class.Class_Name : string.Empty,
                            Section_ID = s.Section_ID,
                            SectionName = s.Section != null ? s.Section.Section : string.Empty,
                            RollNo = s.RollNo != null ? s.RollNo.ToString() : string.Empty,
                            Family_Code = s.Family_Code,
                            CampusName = s.Campus != null ? s.Campus.CampusName : string.Empty,
                            Status = s.cur_Status != null ? s.cur_Status : string.Empty
                        })
                        .ToListAsync();
                }

                _logger.LogInformation("Token validation successful for user: {UserId}", userId);
                return Ok(new AuthResponse
                {
                    User = userDto,
                    Children = children
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token validation");
                return Unauthorized(new { message = "Token validation failed", error = ex.Message });
            }
        }

        private string GenerateJwtToken(tbl_User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var jwtSecret = _configuration["Jwt:Secret"] ?? 
                           "YourSuperSecretKeyHereThatIsAtLeast32CharactersLong12345";
            var key = Encoding.UTF8.GetBytes(jwtSecret);
            
            var issuer = _configuration["Jwt:Issuer"] ?? "Backend";
            var audience = _configuration["Jwt:Audience"] ?? "BackendUsers";
            
            _logger.LogDebug("Generating JWT token with Issuer: {Issuer}, Audience: {Audience}", issuer, audience);
string roleName =user.Role != null ? user.Role.Role : string.Empty;
            // FIX: Use standard claim types to match middleware configuration
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                 new Claim(ClaimTypes.Role, roleName), 
                 new Claim("RoleID", (user.RoleID ?? 0).ToString()),
                new Claim("FamilyID", user.FamilyID?.ToString() ?? "0"),
                new Claim("CampusID", user.CampusID?.ToString() ?? "0"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            
            _logger.LogDebug("Generated token (first 50 chars): {Token}", 
                tokenString.Substring(0, Math.Min(50, tokenString.Length)));
            
            return tokenString;
        }

        private int? GetUserIdFromToken()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();
                _logger.LogDebug("Authorization header: {AuthHeader}", authHeader);
                
                if (string.IsNullOrEmpty(authHeader))
                {
                    _logger.LogDebug("No Authorization header found");
                    return null;
                }

                // Handle both "Bearer token" and just "token" formats
                string token;
                if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    token = authHeader.Substring("Bearer ".Length).Trim();
                }
                else
                {
                    token = authHeader.Trim();
                }

                if (string.IsNullOrEmpty(token))
                {
                    _logger.LogDebug("Empty token");
                    return null;
                }

                _logger.LogDebug("Token extracted, length: {TokenLength}", token.Length);
                
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"] ?? 
                    "YourSuperSecretKeyHereThatIsAtLeast32CharactersLong12345");
                
                // Validate token with the same parameters as middleware
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"] ?? "Backend",
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"] ?? "BackendUsers",
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(5),
                    // Use standard claim types to match middleware
                    NameClaimType = ClaimTypes.Name,
                    RoleClaimType = ClaimTypes.Role
                };

                try
                {
                    var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                    _logger.LogDebug("Token validated successfully");
                    
                    var jwtToken = (JwtSecurityToken)validatedToken;
                    
                    // Look for user ID in standard NameIdentifier claim
                    var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
                    
                    if (userIdClaim != null)
                    {
                        _logger.LogDebug("Found user ID claim: {ClaimType} = {ClaimValue}", userIdClaim.Type, userIdClaim.Value);
                        if (int.TryParse(userIdClaim.Value, out int userId))
                        {
                            _logger.LogDebug("Parsed user ID: {UserId}", userId);
                            return userId;
                        }
                        else
                        {
                            _logger.LogWarning("Could not parse user ID from claim value: {ClaimValue}", userIdClaim.Value);
                        }
                    }
                    else
                    {
                        _logger.LogWarning("No user ID claim found in token");
                    }
                }
                catch (SecurityTokenExpiredException ex)
                {
                    _logger.LogWarning("Token expired: {Message}", ex.Message);
                }
                catch (SecurityTokenInvalidAudienceException ex)
                {
                    _logger.LogWarning("Invalid audience: {Message}", ex.Message);
                }
                catch (SecurityTokenInvalidIssuerException ex)
                {
                    _logger.LogWarning("Invalid issuer: {Message}", ex.Message);
                }
                catch (SecurityTokenInvalidSignatureException ex)
                {
                    _logger.LogWarning("Invalid signature: {Message}", ex.Message);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error validating token");
                }
                
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user ID from token");
                return null;
            }
        }

        private Dictionary<string, bool> GetUserPermissions(int roleId)
        {
            return roleId switch
            {
                1 => new Dictionary<string, bool>
                {
                    ["dashboard"] = true,
                    ["student_management"] = true,
                    ["fee_management"] = true,
                    ["attendance_management"] = true,
                    ["teacher_management"] = true,
                    ["reports"] = true,
                    ["settings"] = true,
                    ["user_management"] = true
                },
                2 => new Dictionary<string, bool>
                {
                    ["dashboard"] = true,
                    ["fee_management"] = true,
                    ["reports"] = true
                },
                3 => new Dictionary<string, bool>
                {
                    ["dashboard"] = true,
                    ["attendance_management"] = true,
                    ["student_view"] = true
                },
                4 => new Dictionary<string, bool>
                {
                    ["dashboard"] = true,
                    ["student_view"] = true,
                    ["fee_view"] = true,
                    ["attendance_view"] = true
                },
                5 => new Dictionary<string, bool>
                {
                    ["dashboard"] = true
                },
                _ => new Dictionary<string, bool>
                {
                    ["dashboard"] = true
                }
            };
        }
    }
}