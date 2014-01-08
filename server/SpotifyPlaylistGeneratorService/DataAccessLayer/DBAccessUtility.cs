namespace SpotifyPlaylistGeneratorService.DataAccessLayer
{
    using System;
    using System.Data;
    using System.Data.SqlClient;

    public static class DBAccessUtility
    {
        /// <summary>
        /// Get DataTable from stored procedure.
        /// </summary>
        /// <param name="commandText"></param>
        /// <param name="parameters"></param>
        /// <param name="connectionString"></param>
        /// <returns></returns>
        internal static DataTable GetDataTable(string commandText, IDbDataParameter[] parameters, string connectionString)
        {
            DataTable dataObjectCollection = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand(commandText, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters);
                        connection.Open();
                        dataObjectCollection.Load(command.ExecuteReader());
                    }
                }
            }
            catch
            {
                throw;
            }
            return dataObjectCollection;
        }

        /// <summary>
        /// Returns a the single value of the first column of the first row in the result set.
        /// </summary>
        /// <param name="commandText"></param>
        /// <param name="connectionString"></param>
        /// <returns></returns>
        internal static int GetScalar(string commandText, IDbDataParameter[] parameters, string connectionString)
        {
            Int32 returnValue = 0;
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand(commandText, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters);
                        connection.Open();
                        returnValue = Convert.ToInt32(command.ExecuteScalar());
                    }
                }
            }
            catch
            {
                throw;
            }
            return returnValue;
        }

        /// <summary>
        /// Executes the given SQL statement.
        /// </summary>
        /// <param name="commandText"></param>
        /// <param name="connectionString"></param>
        internal static void ExecuteStoredProc(string commandText, IDbDataParameter[] parameters, string connectionString)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand(commandText, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters);
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                throw;
            }
        }
    }
}