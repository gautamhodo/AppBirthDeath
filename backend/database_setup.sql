-- =====================================================
-- Hospital Management System Database Setup Script
-- =====================================================
-- This script creates all necessary tables for the backend
-- Run this script on a fresh SQL Server database

USE [HospitalDB]; -- Replace with your database name
GO

-- =====================================================
-- 1. PATIENT MASTER TABLE
-- =====================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PAT_Patient_Master_1' AND xtype='U')
BEGIN
    CREATE TABLE PAT_Patient_Master_1 (
        PM_Card_PK BIGINT IDENTITY(1,1) PRIMARY KEY,
        PM_FirstName NVARCHAR(100),
        PM_MiddleName NVARCHAR(100),
        PM_LastName NVARCHAR(100),
        PM_DOB DATE,
        PM_Sex_FK INT, -- 1=Male, 2=Female, 3=Other
        PM_BloodGroup NVARCHAR(10),
        PM_PrimaryIdentification NVARCHAR(20), -- Mobile number
        PM_Email NVARCHAR(100),
        PM_Nationality NVARCHAR(50),
        PM_CivilID NVARCHAR(20),
        PM_AddedOn DATETIME DEFAULT GETDATE(),
        PM_AddedBy NVARCHAR(50),
        PM_ModifiedOn DATETIME,
        PM_ModifiedBy NVARCHAR(50),
        PM_Status BIT DEFAULT 1,
        PM_Provider_FK BIGINT
    );
    PRINT 'Created table: PAT_Patient_Master_1';
END
ELSE
    PRINT 'Table PAT_Patient_Master_1 already exists';
GO

-- =====================================================
-- 2. IP ADMISSION DETAILS TABLE
-- =====================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='IP_Admission_Details' AND xtype='U')
BEGIN
    CREATE TABLE IP_Admission_Details (
        IAD_ID_PK BIGINT IDENTITY(1,1) PRIMARY KEY,
        IAD_Patient_FK BIGINT,
        IABD_IP_Num NVARCHAR(20),
        IAD_Date DATETIME,
        IAD_Discharge_Date DATETIME,
        IAD_Discharge_Reason INT, -- 1=Normal, 2=Death, 3=Transfer, etc.
        IAD_AddDate DATETIME DEFAULT GETDATE(),
        IAD_AddedBy NVARCHAR(50),
        IAD_ModifiedDate DATETIME,
        IAD_ModifiedBy NVARCHAR(50),
        IAD_Status BIT DEFAULT 1,
        
        FOREIGN KEY (IAD_Patient_FK) REFERENCES PAT_Patient_Master_1(PM_Card_PK)
    );
    PRINT 'Created table: IP_Admission_Details';
END
ELSE
    PRINT 'Table IP_Admission_Details already exists';
GO

-- =====================================================
-- 3. NEWBORN MASTER TABLE
-- =====================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PAT_PatientNewBorn_Master_1' AND xtype='U')
BEGIN
    CREATE TABLE PAT_PatientNewBorn_Master_1 (
        PNBM_ID_PK BIGINT IDENTITY(1,1) PRIMARY KEY,
        PNBM_Card_FK BIGINT, -- Baby's patient ID
        PNBM_Mother_FK BIGINT, -- Mother's patient ID
        PNBM_PatientAgeDay INT,
        PNBM_Weight DECIMAL(5,2),
        PNBM_Length DECIMAL(5,2),
        PNBM_HeadCircumference DECIMAL(5,2),
        PNBM_Term NVARCHAR(20), -- Full term, Pre-term, etc.
        PNBM_DeliveryType_FK INT, -- 1=Normal, 2=C-Section, etc.
        PNBM_AddedOn DATETIME DEFAULT GETDATE(),
        PNBM_AddedBy NVARCHAR(50),
        PNBM_ModifiedOn DATETIME,
        PNBM_ModifiedBy NVARCHAR(50),
        certificateStatus NVARCHAR(20) DEFAULT 'Pending', -- Pending, Issued, Cancelled
        PNBM_Status BIT DEFAULT 1,
        
        FOREIGN KEY (PNBM_Card_FK) REFERENCES PAT_Patient_Master_1(PM_Card_PK),
        FOREIGN KEY (PNBM_Mother_FK) REFERENCES PAT_Patient_Master_1(PM_Card_PK)
    );
    PRINT 'Created table: PAT_PatientNewBorn_Master_1';
END
ELSE
    PRINT 'Table PAT_PatientNewBorn_Master_1 already exists';
GO

-- =====================================================
-- 4. DISCHARGE SUMMARY TABLE (For Death Records)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='IP_Discharge_Summary' AND xtype='U')
BEGIN
    CREATE TABLE IP_Discharge_Summary (
        IDS_ID_PK BIGINT IDENTITY(1,1) PRIMARY KEY,
        IDS_Admit_FK BIGINT,
        IDS_Date DATETIME,
        IDS_ISDeath_Flag BIT DEFAULT 0,
        IDS_CauseOfDeath NVARCHAR(500),
        IDS_AddedDate DATETIME DEFAULT GETDATE(),
        IDS_AddedBy NVARCHAR(50),
        IDS_ModifiedDate DATETIME,
        IDS_ModifiedBy NVARCHAR(50),
        IDS_Status BIT DEFAULT 1,
        
        FOREIGN KEY (IDS_Admit_FK) REFERENCES IP_Admission_Details(IAD_ID_PK)
    );
    PRINT 'Created table: IP_Discharge_Summary';
END
ELSE
    PRINT 'Table IP_Discharge_Summary already exists';
GO

-- =====================================================
-- 5. PARENT DATA TABLE
-- =====================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ParentData' AND xtype='U')
BEGIN
    CREATE TABLE ParentData (
        id NVARCHAR(50) PRIMARY KEY,
        firstName NVARCHAR(100),
        lastName NVARCHAR(100),
        gender NVARCHAR(10),
        dateOfBirth DATE,
        mobileNo NVARCHAR(20),
        email NVARCHAR(100),
        term NVARCHAR(20),
        deliveryType NVARCHAR(50),
        uhid NVARCHAR(20),
        civilIds NVARCHAR(20),
        nationality NVARCHAR(50),
        doctor NVARCHAR(100),
        bloodGroup NVARCHAR(10),
        Added_By NVARCHAR(50),
        Added_on DATETIME DEFAULT GETDATE(),
        Modified_By NVARCHAR(50),
        Modified_on DATETIME,
        Status BIT DEFAULT 1,
        Provider_FK BIGINT
    );
    PRINT 'Created table: ParentData';
END
ELSE
    PRINT 'Table ParentData already exists';
GO

-- =====================================================
-- 6. MORTUARY RECORDS TABLE
-- =====================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='mortuaryRecords' AND xtype='U')
BEGIN
    CREATE TABLE mortuaryRecords (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        patientId BIGINT,
        fullName NVARCHAR(200),
        dateOfDeath DATETIME,
        causeOfDeath NVARCHAR(500),
        mortuaryLocation NVARCHAR(100),
        bodyReleaseDate DATETIME,
        releasedTo NVARCHAR(100),
        relationshipToDeceased NVARCHAR(50),
        contactNumber NVARCHAR(20),
        Added_on DATETIME DEFAULT GETDATE(),
        Added_By NVARCHAR(50),
        Modified_on DATETIME,
        Modified_By NVARCHAR(50),
        Status BIT DEFAULT 1,
        
        FOREIGN KEY (patientId) REFERENCES PAT_Patient_Master_1(PM_Card_PK)
    );
    PRINT 'Created table: mortuaryRecords';
END
ELSE
    PRINT 'Table mortuaryRecords already exists';
GO

-- =====================================================
-- 7. BIRTH RECORDS VIEW (For compatibility)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.views WHERE name='birthRecords')
BEGIN
    EXEC('
    CREATE VIEW birthRecords AS
    SELECT 
        PNBM.PNBM_Card_FK AS id,
        PNBM.PNBM_Mother_FK AS motherId,
        ''B/O '' + ISNULL(Mother.PM_FirstName, '''') + '' '' + ISNULL(Mother.PM_LastName, '''') AS babyName,
        ISNULL(Mother.PM_FirstName, '''') + '' '' + ISNULL(Mother.PM_LastName, '''') AS motherName,
        Baby.PM_DOB AS dateOfBirth,
        Baby.PM_PrimaryIdentification AS mobileNo,
        Baby.PM_Sex_FK AS gender,
        Baby.PM_BloodGroup AS bloodGroup,
        PNBM.PNBM_PatientAgeDay AS ageInDays,
        PNBM.PNBM_Weight AS weight,
        PNBM.PNBM_Length AS length,
        PNBM.PNBM_HeadCircumference AS headCircumference,
        PNBM.PNBM_Term AS term,
        PNBM.PNBM_DeliveryType_FK AS deliveryType,
        PNBM.PNBM_AddedOn AS Added_on,
        PNBM.certificateStatus
    FROM PAT_PatientNewBorn_Master_1 PNBM
    JOIN PAT_Patient_Master_1 Mother ON PNBM.PNBM_Mother_FK = Mother.PM_Card_PK
    LEFT JOIN PAT_Patient_Master_1 Baby ON PNBM.PNBM_Card_FK = Baby.PM_Card_PK
    WHERE PNBM.PNBM_Status = 1
    ');
    PRINT 'Created view: birthRecords';
END
ELSE
    PRINT 'View birthRecords already exists';
GO

-- =====================================================
-- 8. DEATH RECORDS VIEW (For compatibility)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.views WHERE name='deathRecords')
BEGIN
    EXEC('
    CREATE VIEW deathRecords AS
    SELECT 
        IAD.IAD_ID_PK AS id,
        CONCAT_WS('' '', PM.PM_FirstName, PM.PM_MiddleName, PM.PM_LastName) AS fullName,
        PM.PM_Sex_FK AS gender,
        IAD.IAD_Discharge_Date AS dateOfDeath,
        IAD.IABD_IP_Num AS ipNo,
        IAD.IAD_AddDate AS Added_on
    FROM IP_Admission_Details IAD
    JOIN PAT_Patient_Master_1 PM ON IAD.IAD_Patient_fk = PM.PM_Card_PK
    WHERE IAD.IAD_Discharge_Reason = 2 AND IAD.IAD_Status = 1
    ');
    PRINT 'Created view: deathRecords';
END
ELSE
    PRINT 'View deathRecords already exists';
GO

-- =====================================================
-- 9. LOOKUP TABLES
-- =====================================================

-- Gender Lookup
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='LU_Gender' AND xtype='U')
BEGIN
    CREATE TABLE LU_Gender (
        GenderId INT PRIMARY KEY,
        GenderName NVARCHAR(20)
    );
    
    INSERT INTO LU_Gender VALUES (1, 'Male'), (2, 'Female'), (3, 'Other');
    PRINT 'Created table: LU_Gender';
END
ELSE
    PRINT 'Table LU_Gender already exists';
GO

-- Delivery Type Lookup
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='LU_DeliveryType' AND xtype='U')
BEGIN
    CREATE TABLE LU_DeliveryType (
        DeliveryTypeId INT PRIMARY KEY,
        DeliveryTypeName NVARCHAR(50)
    );
    
    INSERT INTO LU_DeliveryType VALUES 
    (1, 'Normal Vaginal Delivery'),
    (2, 'Cesarean Section'),
    (3, 'Vacuum Assisted'),
    (4, 'Forceps Assisted');
    PRINT 'Created table: LU_DeliveryType';
END
ELSE
    PRINT 'Table LU_DeliveryType already exists';
GO

-- Discharge Reason Lookup
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='LU_DischargeReason' AND xtype='U')
BEGIN
    CREATE TABLE LU_DischargeReason (
        DischargeReasonId INT PRIMARY KEY,
        DischargeReasonName NVARCHAR(50)
    );
    
    INSERT INTO LU_DischargeReason VALUES 
    (1, 'Normal Discharge'),
    (2, 'Death'),
    (3, 'Transfer'),
    (4, 'Against Medical Advice'),
    (5, 'Absconded');
    PRINT 'Created table: LU_DischargeReason';
END
ELSE
    PRINT 'Table LU_DischargeReason already exists';
GO

-- =====================================================
-- 10. INDEXES FOR PERFORMANCE
-- =====================================================

-- Index on Patient Master for faster lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Patient_Name')
BEGIN
    CREATE INDEX IX_Patient_Name ON PAT_Patient_Master_1 (PM_FirstName, PM_LastName);
    PRINT 'Created index: IX_Patient_Name';
END

-- Index on Birth Records for date queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Birth_AddedOn')
BEGIN
    CREATE INDEX IX_Birth_AddedOn ON PAT_PatientNewBorn_Master_1 (PNBM_AddedOn DESC);
    PRINT 'Created index: IX_Birth_AddedOn';
END

-- Index on Admission Details for date queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Admission_Date')
BEGIN
    CREATE INDEX IX_Admission_Date ON IP_Admission_Details (IAD_AddDate DESC);
    PRINT 'Created index: IX_Admission_Date';
END

-- =====================================================
-- 11. SAMPLE DATA (Optional - Remove if not needed)
-- =====================================================

-- Sample Mother Patient
IF NOT EXISTS (SELECT * FROM PAT_Patient_Master_1 WHERE PM_FirstName = 'Sample' AND PM_LastName = 'Mother')
BEGIN
    INSERT INTO PAT_Patient_Master_1 (PM_FirstName, PM_LastName, PM_DOB, PM_Sex_FK, PM_BloodGroup, PM_PrimaryIdentification)
    VALUES ('Sample', 'Mother', '1990-01-01', 2, 'O+', '1234567890');
    PRINT 'Inserted sample mother record';
END

-- Sample Baby Patient
DECLARE @MotherId BIGINT = (SELECT PM_Card_PK FROM PAT_Patient_Master_1 WHERE PM_FirstName = 'Sample' AND PM_LastName = 'Mother');

IF @MotherId IS NOT NULL AND NOT EXISTS (SELECT * FROM PAT_Patient_Master_1 WHERE PM_FirstName = 'Baby' AND PM_LastName = 'Sample')
BEGIN
    INSERT INTO PAT_Patient_Master_1 (PM_FirstName, PM_LastName, PM_DOB, PM_Sex_FK, PM_BloodGroup)
    VALUES ('Baby', 'Sample', GETDATE(), 1, 'O+');
    
    DECLARE @BabyId BIGINT = SCOPE_IDENTITY();
    
    -- Sample Birth Record
    INSERT INTO PAT_PatientNewBorn_Master_1 (PNBM_Card_FK, PNBM_Mother_FK, PNBM_PatientAgeDay, PNBM_Weight, PNBM_Length, PNBM_Term, PNBM_DeliveryType_FK)
    VALUES (@BabyId, @MotherId, 0, 3.2, 50.0, 'Full Term', 1);
    
    PRINT 'Inserted sample birth record';
END

-- =====================================================
-- 12. STORED PROCEDURES (Optional)
-- =====================================================

-- Procedure to get recent activities
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_GetRecentActivities')
    DROP PROCEDURE sp_GetRecentActivities;
GO

CREATE PROCEDURE sp_GetRecentActivities
    @Limit INT = 20
AS
BEGIN
    SELECT TOP (@Limit) * FROM (
        SELECT id, Added_on as date, 'ParentData' as type FROM ParentData WHERE Status = 1
        UNION ALL
        SELECT CAST(id AS NVARCHAR), Added_on as date, 'birthRecords' as type FROM birthRecords
        UNION ALL
        SELECT CAST(id AS NVARCHAR), Added_on as date, 'deathRecords' as type FROM deathRecords
        UNION ALL
        SELECT CAST(id AS NVARCHAR), Added_on as date, 'mortuaryRecords' as type FROM mortuaryRecords WHERE Status = 1
    ) AS Activities
    ORDER BY date DESC;
END
GO

PRINT 'Created stored procedure: sp_GetRecentActivities';

-- =====================================================
-- SCRIPT COMPLETION
-- =====================================================
PRINT '=====================================================';
PRINT 'Database setup completed successfully!';
PRINT 'All tables, views, indexes, and sample data created.';
PRINT '=====================================================';
GO