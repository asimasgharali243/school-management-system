// using System;
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

// namespace school_management_Backend.Models
// {
//     [Table("tbl_LectureSections")]
//     public class LectureSection
//     {
//         [Key]
//         [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
//         public int Id { get; set; }

//         [Required]
//         public int LectureId { get; set; }

//         [Required]
//         public int SectionId { get; set; }

//         public DateTime CreatedAt { get; set; } = DateTime.Now;

//         [ForeignKey("LectureId")]
//         public virtual Lecture Lecture { get; set; }

//         [ForeignKey("SectionId")]
//         public virtual tbl_AddSection Section { get; set; }
//     }
// }
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace school_management_Backend.Models
{
    [Table("tbl_LectureSections")]
    public class LectureSection
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int LectureId { get; set; }

        [Required]
        public int SectionId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("LectureId")]
        public virtual Lecture Lecture { get; set; }

        [ForeignKey("SectionId")]
        public virtual tbl_AddSection Section { get; set; }
    }
}