// Controllers/UsersController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;
using System.Security.Claims;
using System.Text;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ApplicationDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _context.tbl_User
                    .Include(u => u.Role)
                    .Select(u => new
                    {
                        u.ID,
                        u.UserName,
                        Name = u.Name,
                        u.Designation,
                        u.Status,
                        u.RoleID,
                        RoleName = u.Role != null ? u.Role.Role : "",
                        u.CampusID,
                        u.FamilyID,
                        u.EmployeeCode,
                        CreatedAt = u.CreateDT
                    })
                    .OrderBy(u => u.UserName)
                    .ToListAsync();

                return Ok(new { Success = true, Data = users });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await _context.tbl_User
                    .Include(u => u.Role)
                    .Where(u => u.ID == id)
                    .Select(u => new
                    {
                        u.ID,
                        u.UserName,
                        Name = u.Name,
                        u.Designation,
                        u.Status,
                        u.RoleID,
                        RoleName = u.Role != null ? u.Role.Role : "",
                        u.CampusID,
                        u.FamilyID,
                        u.EmployeeCode,
                        CreatedAt = u.CreateDT
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                    return NotFound(new { Success = false, Message = "User not found" });

                return Ok(new { Success = true, Data = user });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Users/validate-username
        [HttpGet("validate-username")]
        [AllowAnonymous]
        public async Task<IActionResult> ValidateUsername([FromQuery] string username)
        {
            try
            {
                if (string.IsNullOrEmpty(username))
                    return Ok(new { exists = false });

                var exists = await _context.tbl_User
                    .AnyAsync(u => u.UserName != null && u.UserName.ToLower() == username.ToLower());

                return Ok(new { exists });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating username");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            try
            {
                // Check if username exists
                var existingUser = await _context.tbl_User
                    .AnyAsync(u => u.UserName != null && u.UserName.ToLower() == request.Username.ToLower());

                if (existingUser)
                    return BadRequest(new { Success = false, Message = "Username already exists" });

                // Encode password using the same method as AuthController
                var encodedPassword = EncodePassword(request.Password);

                var user = new tbl_User
                {
                    UserName = request.Username,
                    Name = request.FullName,
                    Password = encodedPassword,
                    Designation = request.UserType,
                    RoleID = GetRoleIdFromType(request.UserType),
                    Status = true,
                    CreateDT = DateTime.Now,
                    CreatedBy = GetCurrentUserId()
                };

                _context.tbl_User.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { Success = true, Message = "User created successfully", Data = new { user.ID } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // POST: api/Users/{id}/update
        [HttpPost("{id}/update")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var user = await _context.tbl_User.FindAsync(id);
                if (user == null)
                    return NotFound(new { Success = false, Message = "User not found" });

                user.Name = request.FullName ?? user.Name;
                user.Designation = request.UserType ?? user.Designation;
                user.RoleID = GetRoleIdFromType(request.UserType);
                user.Status = request.IsActive;
                user.ModifiedDT = DateTime.Now;
                user.ModifiedBy = GetCurrentUserId();

                await _context.SaveChangesAsync();

                return Ok(new { Success = true, Message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // POST: api/Users/{id}/reset-password
        [HttpPost("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPasswordRequest request)
        {
            try
            {
                var user = await _context.tbl_User.FindAsync(id);
                if (user == null)
                    return NotFound(new { Success = false, Message = "User not found" });

                user.Password = EncodePassword(request.NewPassword);
                user.ModifiedDT = DateTime.Now;
                user.ModifiedBy = GetCurrentUserId();

                await _context.SaveChangesAsync();

                return Ok(new { Success = true, Message = "Password reset successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting password");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // POST: api/Users/{id}/status
        [HttpPost("{id}/status")]
        public async Task<IActionResult> ToggleUserStatus(int id, [FromBody] ToggleStatusRequest request)
        {
            try
            {
                var user = await _context.tbl_User.FindAsync(id);
                if (user == null)
                    return NotFound(new { Success = false, Message = "User not found" });

                user.Status = request.IsActive;
                user.ModifiedDT = DateTime.Now;
                user.ModifiedBy = GetCurrentUserId();

                await _context.SaveChangesAsync();

                return Ok(new { Success = true, Message = $"User {(request.IsActive ? "activated" : "deactivated")} successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling user status");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // DELETE: api/Users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.tbl_User.FindAsync(id);
                if (user == null)
                    return NotFound(new { Success = false, Message = "User not found" });

                // Don't allow deleting admin users (RoleID = 1)
                if (user.RoleID == 1)
                    return BadRequest(new { Success = false, Message = "Cannot delete admin users" });

                _context.tbl_User.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { Success = true, Message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        #region Helper Methods

        private string EncodePassword(string password)
        {
            // Use the same encoding as AuthController
            byte[] bt = Encoding.ASCII.GetBytes(password);
            string str2 = Convert.ToBase64String(bt);
            byte[] bt2 = Encoding.ASCII.GetBytes(str2);
            return Convert.ToBase64String(bt2);
        }

        private int GetRoleIdFromType(string userType)
        {
            return userType?.ToLower() switch
            {
                "admin" => 1,
                "manager" => 2,
                "teacher" => 3,
                "parent" => 4,
                "student" => 5,
                "user" => 3,
                _ => 3 // Default to User/Teacher
            };
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
                return userId;
            return 1;
        }

        #endregion

        #region Request DTOs

        public class CreateUserRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string FullName { get; set; } = string.Empty;
            public string? Email { get; set; }
            public string? Phone { get; set; }
            public string UserType { get; set; } = "User";
            public string? ProjectName { get; set; }
        }

        public class UpdateUserRequest
        {
            public string? FullName { get; set; }
            public string? Email { get; set; }
            public string? Phone { get; set; }
            public string UserType { get; set; } = "User";
            public bool IsActive { get; set; } = true;
            public string? ProjectName { get; set; }
        }

        public class ResetPasswordRequest
        {
            public string NewPassword { get; set; } = string.Empty;
        }

        public class ToggleStatusRequest
        {
            public bool IsActive { get; set; }
        }

        #endregion
    }
}