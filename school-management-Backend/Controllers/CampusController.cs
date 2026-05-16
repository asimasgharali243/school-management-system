// Controllers/CampusController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using school_management_Backend.Data;

namespace school_management_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CampusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CampusController> _logger;

        public CampusController(ApplicationDbContext context, ILogger<CampusController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Campus
        [HttpGet]
        public async Task<IActionResult> GetAllCampuses()
        {
            try
            {
                var campuses = await _context.tbl_Campus
                    .Select(c => new
                    {
                        c.CampusID,
                        c.CampusName,
                        c.CampusCode,
                        c.CampusAddress
                    })
                    .ToListAsync();

                return Ok(new { Success = true, Data = campuses });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting campuses");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Campus/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCampusById(int id)
        {
            try
            {
                var campus = await _context.tbl_Campus
                    .Where(c => c.CampusID == id)
                    .Select(c => new
                    {
                        c.CampusID,
                        c.CampusName,
                        c.CampusCode,
                        c.CampusAddress
                    })
                    .FirstOrDefaultAsync();

                if (campus == null)
                    return NotFound(new { Success = false, Message = "Campus not found" });

                return Ok(new { Success = true, Data = campus });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting campus by id");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }
    }
}