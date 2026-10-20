export interface AndroidFile {
  path: string;
  name: string;
  language: string;
  content: string;
  description: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Android Studio Setup & APK Compilation Guide',
    content: `# ReminderHub – Student Reminder & Planner
**Package**: \`com.example.reminderhub\`  
**Tech Stack**: Kotlin, Jetpack Compose, Room Database, Material 3, WorkManager, Kotlin Coroutines & Flow.

---

## 🛠️ How to Open, Run, and Build APK

### 1. Requirements
- **Android Studio**: Android Studio Hedgehog (2023.1.1) or Ladybug (2024.2+) recommended
- **JDK**: Java 17 or Java 21
- **Android SDK**: Minimum SDK 26 (Android 8.0 Oreo), Target SDK 35 (Android 15)

### 2. Opening the Project
1. Extract the downloaded \`ReminderHub-Android-Project.zip\`.
2. Open **Android Studio**.
3. Select **File > Open...** and navigate to the extracted root folder.
4. Allow Gradle to sync dependencies (it usually takes 1-2 minutes).

### 3. Running on Device or Emulator
1. Connect your Android phone via USB with **USB Debugging** enabled, OR start an Android Virtual Device (AVD).
2. Click the green **Run (▶)** button in the top toolbar or press \`Shift + F10\`.
3. The app will install and open immediately with pre-loaded college demo data!

### 4. Building the Production / Debug APK
You can build the APK in two ways:

#### Option A: Using Android Studio UI
1. In the top menu, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Android Studio will compile the Room schemas, Compose layouts, and generate the APK.
3. In the bottom-right notification pop-up, click **locate** to reveal the APK file in your system file explorer.

#### Option B: Using Command Line (Terminal)
In Android Studio's built-in Terminal (or your OS terminal in the project directory), run:

\`\`\`bash
# On Linux / macOS:
./gradlew assembleDebug

# On Windows:
gradlew.bat assembleDebug
\`\`\`

### 5. Locating the Generated APK
Once the build completes successfully, find your APK at:
\`\`\`
app/build/outputs/apk/debug/app-debug.apk
\`\`\`
You can transfer \`app-debug.apk\` to any Android smartphone via WhatsApp, Google Drive, or USB and tap to install!
`,
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Project)',
    language: 'kotlin',
    description: 'Root Gradle configuration file',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`,
  },
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (App Module)',
    language: 'kotlin',
    description: 'App dependencies: Compose, Room, WorkManager, Coroutines',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.example.reminderhub"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.reminderhub"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    
    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")

    // WorkManager for background scheduled reminders
    implementation("androidx.work:work-runtime-ktx:2.9.1")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    description: 'Application Manifest, Permissions & Receivers',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions required for ReminderHub -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:name=".ReminderApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ReminderHub">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.ReminderHub">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- BroadcastReceiver to reschedule exact alarms after device reboot -->
        <receiver
            android:name=".receiver.BootReceiver"
            android:enabled="true"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.MY_PACKAGE_REPLACED" />
            </intent-filter>
        </receiver>

    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/example/reminderhub/data/ReminderEntity.kt',
    name: 'ReminderEntity.kt',
    language: 'kotlin',
    description: 'Room Database Entity with all required student fields',
    content: `package com.example.reminderhub.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "reminders")
data class ReminderEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String,
    val category: String, // assignment, exam, fee, event, meeting, project, personal, important
    val date: String,     // YYYY-MM-DD
    val time: String,     // HH:mm
    val priority: String, // low, medium, high
    val location: String? = null,
    val notes: String? = null,
    val repeatType: String = "none", // none, daily, weekly, monthly
    val notificationTime: String = "1_hour", // at_time, 10_min, 30_min, 1_hour, 1_day
    val completed: Boolean = false,
    val createdDate: Long = System.currentTimeMillis(),
    val updatedDate: Long = System.currentTimeMillis()
)
`,
  },
  {
    path: 'app/src/main/java/com/example/reminderhub/data/ReminderDao.kt',
    name: 'ReminderDao.kt',
    language: 'kotlin',
    description: 'Room Data Access Object (DAO) with reactive Flow queries',
    content: `package com.example.reminderhub.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface ReminderDao {

    @Query("SELECT * FROM reminders ORDER BY date ASC, time ASC")
    fun getAllReminders(): Flow<List<ReminderEntity>>

    @Query("SELECT * FROM reminders WHERE completed = 0 ORDER BY date ASC, time ASC")
    fun getActiveReminders(): Flow<List<ReminderEntity>>

    @Query("SELECT * FROM reminders WHERE date = :todayDate ORDER BY time ASC")
    fun getTodayReminders(todayDate: String): Flow<List<ReminderEntity>>

    @Query("SELECT * FROM reminders WHERE completed = 1 ORDER BY updatedDate DESC")
    fun getCompletedReminders(): Flow<List<ReminderEntity>>

    @Query("SELECT * FROM reminders WHERE date < :todayDate AND completed = 0 ORDER BY date ASC, time ASC")
    fun getOverdueReminders(todayDate: String): Flow<List<ReminderEntity>>

    @Query("SELECT * FROM reminders WHERE date > :todayDate AND completed = 0 ORDER BY date ASC, time ASC LIMIT 5")
    fun getUpcomingReminders(todayDate: String): Flow<List<ReminderEntity>>

    @Query("SELECT * FROM reminders WHERE id = :id LIMIT 1")
    suspend fun getReminderById(id: Long): ReminderEntity?

    @Query("""
        SELECT * FROM reminders 
        WHERE (title LIKE '%' || :query || '%' 
           OR description LIKE '%' || :query || '%' 
           OR category LIKE '%' || :query || '%' 
           OR location LIKE '%' || :query || '%')
        ORDER BY date ASC, time ASC
    """)
    fun searchReminders(query: String): Flow<List<ReminderEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReminder(reminder: ReminderEntity): Long

    @Update
    suspend fun updateReminder(reminder: ReminderEntity)

    @Delete
    suspend fun deleteReminder(reminder: ReminderEntity)

    @Query("DELETE FROM reminders WHERE completed = 1")
    suspend fun deleteCompletedReminders(): Int

    @Query("DELETE FROM reminders")
    suspend fun deleteAllReminders()
}
`,
  },
  {
    path: 'app/src/main/java/com/example/reminderhub/data/ReminderDatabase.kt',
    name: 'ReminderDatabase.kt',
    language: 'kotlin',
    description: 'Room Database Singleton with Demo Data Pre-population',
    content: `package com.example.reminderhub.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Database(entities = [ReminderEntity::class], version = 1, exportSchema = false)
abstract class ReminderDatabase : RoomDatabase() {

    abstract fun reminderDao(): ReminderDao

    companion object {
        @Volatile
        private var INSTANCE: ReminderDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): ReminderDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ReminderDatabase::class.java,
                    "reminder_hub_database"
                )
                .addCallback(DatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateDemoData(database.reminderDao())
                    }
                }
            }

            suspend fun populateDemoData(dao: ReminderDao) {
                val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
                val cal = Calendar.getInstance()
                
                cal.add(Calendar.DAY_OF_YEAR, 1)
                val tomorrow = sdf.format(cal.time)

                cal.add(Calendar.DAY_OF_YEAR, 2)
                val inThreeDays = sdf.format(cal.time)

                cal.add(Calendar.DAY_OF_YEAR, 2)
                val inFiveDays = sdf.format(cal.time)

                dao.insertReminder(
                    ReminderEntity(
                        title = "Submit DBMS Assignment",
                        description = "Normalization and B+ trees practice problems.",
                        category = "assignment",
                        date = tomorrow,
                        time = "23:59",
                        priority = "high",
                        location = "CSE Portal",
                        notificationTime = "1_day"
                    )
                )
                dao.insertReminder(
                    ReminderEntity(
                        title = "Java Internal Exam",
                        description = "OOP concepts, Collections, and Multi-threading.",
                        category = "exam",
                        date = inThreeDays,
                        time = "10:00",
                        priority = "high",
                        location = "Room 302",
                        notificationTime = "1_hour"
                    )
                )
                dao.insertReminder(
                    ReminderEntity(
                        title = "Semester Fee Payment",
                        description = "Tuition and lab fees deadline.",
                        category = "fee",
                        date = inFiveDays,
                        time = "17:00",
                        priority = "high",
                        location = "Accounts Office",
                        notificationTime = "1_day"
                    )
                )
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/reminderhub/worker/NotificationWorker.kt',
    name: 'NotificationWorker.kt',
    language: 'kotlin',
    description: 'WorkManager background worker executing local notifications',
    content: `package com.example.reminderhub.worker

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.reminderhub.MainActivity
import com.example.reminderhub.R

class NotificationWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        val title = inputData.getString("TITLE") ?: "Reminder Alert"
        val message = inputData.getString("MESSAGE") ?: "You have a scheduled deadline."
        val category = inputData.getString("CATEGORY") ?: "assignment"
        val reminderId = inputData.getLong("REMINDER_ID", 0L)

        showNotification(title, message, category, reminderId)
        return Result.success()
    }

    private fun showNotification(title: String, message: String, category: String, reminderId: Long) {
        val channelId = "reminderhub_channel"
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Student Reminders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Deadlines, exams, and fee alerts"
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            putExtra("REMINDER_ID", reminderId)
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            reminderId.toInt(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val emoji = when (category) {
            "assignment" -> "📚"
            "exam" -> "📝"
            "fee" -> "💰"
            "event" -> "🎉"
            "meeting" -> "📅"
            "project" -> "📋"
            "personal" -> "🎯"
            else -> "⚠️"
        }

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("\$emoji \$title")
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        notificationManager.notify(reminderId.toInt(), notification)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/reminderhub/ui/ReminderApp.kt',
    name: 'ReminderApp.kt',
    language: 'kotlin',
    description: 'Jetpack Compose Main Screen with Scaffold, BottomBar, and FAB',
    content: `package com.example.reminderhub.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.*
import com.example.reminderhub.ui.screens.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReminderApp() {
    val navController = rememberNavController()
    var currentRoute by remember { mutableStateOf("home") }
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = currentRoute == "home",
                    onClick = { currentRoute = "home"; navController.navigate("home") },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home") }
                )
                NavigationBarItem(
                    selected = currentRoute == "tasks",
                    onClick = { currentRoute = "tasks"; navController.navigate("tasks") },
                    icon = { Icon(Icons.Default.CheckCircle, contentDescription = "Tasks") },
                    label = { Text("Tasks") }
                )
                NavigationBarItem(
                    selected = currentRoute == "calendar",
                    onClick = { currentRoute = "calendar"; navController.navigate("calendar") },
                    icon = { Icon(Icons.Default.DateRange, contentDescription = "Calendar") },
                    label = { Text("Calendar") }
                )
                NavigationBarItem(
                    selected = currentRoute == "insights",
                    onClick = { currentRoute = "insights"; navController.navigate("insights") },
                    icon = { Icon(Icons.Default.Info, contentDescription = "Insights") },
                    label = { Text("Insights") }
                )
                NavigationBarItem(
                    selected = currentRoute == "settings",
                    onClick = { currentRoute = "settings"; navController.navigate("settings") },
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                    label = { Text("Settings") }
                )
            }
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Reminder")
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("home") { HomeScreen(onAddClick = { showAddDialog = true }) }
            composable("tasks") { TasksScreen() }
            composable("calendar") { CalendarScreen() }
            composable("insights") { InsightsScreen() }
            composable("settings") { SettingsScreen() }
        }

        if (showAddDialog) {
            AddReminderDialog(onDismiss = { showAddDialog = false })
        }
    }
}
`,
  },
];
