using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("tbl_GalleryAlbum")]
    public class GalleryAlbum
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AlbumId { get; set; }

        [Required]
        [MaxLength(250)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        public int ClassId { get; set; }
        public int? SectionId { get; set; }
        public int? SubjectId { get; set; }

        [MaxLength(500)]
        public string CoverImageUrl { get; set; }

        public int CreatedBy { get; set; }
        public DateTime CreatedDt { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDt { get; set; }
        public bool IsActive { get; set; } = true;
        public int? CampusId { get; set; }
        public int? SessionYear { get; set; }
        public DateTime? EventDate { get; set; }

        [ForeignKey("ClassId")]
        public virtual tbl_AddClass Class { get; set; }

        [ForeignKey("SectionId")]
        public virtual tbl_AddSection Section { get; set; }

        public virtual ICollection<GalleryMedia> GalleryMedia { get; set; }
    }
}