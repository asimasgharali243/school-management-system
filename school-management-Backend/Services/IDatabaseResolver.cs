using System.Threading.Tasks;

namespace school_management_Backend.Services
{
    public interface IDatabaseResolver
    {
        Task<string> ResolveDatabaseForUserAsync(string username, string password);
        string GetCurrentDatabase();
        void SetCurrentDatabase(string databaseName);
        bool IsMultiTenantEnabled();
    }
}