// Controllers/ClassController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;
using school_management_Backend.Models;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClassController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ClassController> _logger;

        public ClassController(ApplicationDbContext context, ILogger<ClassController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Class
        [HttpGet]
        public async Task<IActionResult> GetAllClasses()
        {
            try
            {
                var classes = await _context.tbl_AddClass
                    .Where(c => c.Active == true)
                    .OrderBy(c => c.sort_by)
                    .Select(c => new
                    {
                        c.Class_ID,
                        c.Class_Name,
                        c.Active,
                        c.sort_by,
                        c.CampusID,
                        c.ClassGroupID
                    })
                    .ToListAsync();

                return Ok(new { Success = true, Data = classes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting classes");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Class/active
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveClasses()
        {
            try
            {
                var classes = await _context.tbl_AddClass
                    .Where(c => c.Active == true)
                    .OrderBy(c => c.sort_by)
                    .Select(c => new
                    {
                        c.Class_ID,
                        c.Class_Name,
                        c.sort_by
                    })
                    .ToListAsync();

                return Ok(new { Success = true, Data = classes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active classes");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Class/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClassById(int id)
        {
            try
            {
                var classItem = await _context.tbl_AddClass
                    .Where(c => c.Class_ID == id)
                    .Select(c => new
                    {
                        c.Class_ID,
                        c.Class_Name,
                        c.Active,
                        c.sort_by,
                        c.CampusID,
                        c.ClassGroupID
                    })
                    .FirstOrDefaultAsync();

                if (classItem == null)
                    return NotFound(new { Success = false, Message = "Class not found" });

                return Ok(new { Success = true, Data = classItem });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting class by id");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }
    }
}