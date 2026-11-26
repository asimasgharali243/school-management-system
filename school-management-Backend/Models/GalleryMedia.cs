using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("tbl_GalleryMedia")]
    public class GalleryMedia
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MediaId { get; set; }

        public int AlbumId { get; set; }

        [Required]
        [MaxLength(500)]
        public string MediaUrl { get; set; }

        [MaxLength(500)]
        public string ThumbnailUrl { get; set; }

        [MaxLength(250)]
        public string FileName { get; set; }

        public long? FileSize { get; set; }
        public int SortOrder { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDt { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;

        [ForeignKey("AlbumId")]
        public virtual GalleryAlbum Album { get; set; }
    }
}