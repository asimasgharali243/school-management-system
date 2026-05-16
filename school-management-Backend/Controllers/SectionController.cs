// Controllers/SectionController.cs
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
    public class SectionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SectionController> _logger;

        public SectionController(ApplicationDbContext context, ILogger<SectionController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Section
        [HttpGet]
        public async Task<IActionResult> GetAllSections()
        {
            try
            {
                var sections = await _context.tbl_AddSection
                    .Where(s => s.Active == true)
                    .OrderBy(s => s.sortby)
                    .Select(s => new
                    {
                        s.ID,
                        s.Section,
                        s.Class_ID,
                        s.Active,
                        s.sortby
                    })
                    .ToListAsync();

                return Ok(new { Success = true, Data = sections });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sections");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Section/byclass/{classId}
        [HttpGet("byclass/{classId}")]
        public async Task<IActionResult> GetSectionsByClass(int classId)
        {
            try
            {
                var sections = await _context.tbl_AddSection
                    .Where(s => s.Class_ID == classId && s.Active == true)
                    .OrderBy(s => s.sortby)
                    .Select(s => new
                    {
                        s.ID,
                        s.Section,
                        s.Class_ID,
                        s.Active
                    })
                    .ToListAsync();

                return Ok(new { Success = true, Data = sections });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sections by class");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        // GET: api/Section/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSectionById(int id)
        {
            try
            {
                var section = await _context.tbl_AddSection
                    .Where(s => s.ID == id)
                    .Select(s => new
                    {
                        s.ID,
                        s.Section,
                        s.Class_ID,
                        s.Active
                    })
                    .FirstOrDefaultAsync();

                if (section == null)
                    return NotFound(new { Success = false, Message = "Section not found" });

                return Ok(new { Success = true, Data = section });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting section by id");
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }
    }
}