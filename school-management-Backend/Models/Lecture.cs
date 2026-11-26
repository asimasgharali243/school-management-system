// using System;
// using System.Collections.Generic;
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

// namespace school_management_Backend.Models
// {
//     [Table("tblVideoLectures")]
//     public class Lecture
//     {
//         [Key]
//         [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
//         public int LectureId { get; set; }

//         [Required]
//         [MaxLength(250)]
//         public string Title { get; set; }

//         public string Description { get; set; }

//         [Required]
//         [MaxLength(500)]
//         public string YoutubeUrl { get; set; }

//         [Required]
//         [MaxLength(100)]
//         public string YoutubeVideoId { get; set; }

//         [MaxLength(500)]
//         public string ThumbnailUrl { get; set; }

//         [Required]
//         public int ClassId { get; set; }

//         [Required]
//         public int SubjectId { get; set; }

//         public int? BookId { get; set; }

//         public int? ChapterId { get; set; }

//         public int? TopicId { get; set; }

//         [Required]
//         public int TeacherId { get; set; }

//         public bool? IsLive { get; set; } = false;

//         public bool? IsPublished { get; set; } = false;

//         public bool? IsFree { get; set; } = true;

//         public int? LectureOrder { get; set; }

//         [MaxLength(300)]
//         public string Tags { get; set; }

//         [MaxLength(500)]
//         public string AttachmentUrl { get; set; }

//         public DateTime CreatedAt { get; set; } = DateTime.Now;

//         public DateTime? UpdatedAt { get; set; }

//         public int? CreatedBy { get; set; }

//         public int? UpdatedBy { get; set; }

//         public bool IsActive { get; set; } = true;

//         // Navigation property
//         [ForeignKey("ClassId")]
//         public virtual tbl_AddClass Class { get; set; }

//         [ForeignKey("SubjectId")]
//         public virtual tbl_Subject Subject { get; set; }

//         public virtual ICollection<LectureSection> LectureSections { get; set; }
//     }
// }
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("tblVideoLectures")]
    public class Lecture
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LectureId { get; set; }

        
        [MaxLength(250)]
        public string Title { get; set; }

        public string Description { get; set; }

        [MaxLength(500)]
        public string YoutubeUrl { get; set; }

        [MaxLength(100)]
        public string YoutubeVideoId { get; set; }

        [MaxLength(500)]
        public string ThumbnailUrl { get; set; }

        public int ClassId { get; set; }
public int SubjectId { get; set; }

        public int? BookId { get; set; }

        public long? ChapterId { get; set; }

        public long? TopicId { get; set; }

        public int TeacherId { get; set; }

        public bool? IsLive { get; set; } = false;

        public bool? IsPublished { get; set; } = false;

        public bool? IsFree { get; set; } = true;

        public int? LectureOrder { get; set; }

        [MaxLength(300)]
        public string Tags { get; set; }

        [MaxLength(500)]
        public string AttachmentUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }

        public int? CreatedBy { get; set; }

        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        [ForeignKey("ClassId")]
        public virtual tbl_AddClass Class { get; set; }

        

        [ForeignKey("SubjectId")]
        public virtual tbl_Subject Subject { get; set; }

        [ForeignKey("BookId")]
        public virtual tbl_SubjectBook Book { get; set; }

        [ForeignKey("ChapterId")]
        public virtual tbl_SubjectChapter Chapter { get; set; }

        [ForeignKey("TopicId")]
        public virtual tbl_ChapterTopic Topic { get; set; }

        public virtual ICollection<LectureSection> LectureSections { get; set; }
    }
}