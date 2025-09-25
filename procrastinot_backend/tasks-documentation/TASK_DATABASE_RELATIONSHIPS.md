# 🗄️ TASK DATABASE RELATIONSHIPS & DATA FLOW

## 🔗 Complete Relationship Mapping

### 1. TASK ↔ USER RELATIONSHIP
```
Relationship Type: Many-to-One (Many Tasks belong to One User)
Implementation: Reference-based with bidirectional updates

USER MODEL:
{
  _id: ObjectId,
  username: String,
  email: String,
  tasks: [ObjectId] // Array of Task references
}

TASK MODEL:
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  title: String,
  // ... other fields
}

DATA FLOW:
1. Task Creation → Updates User.tasks[] array
2. Task Deletion → Removes from User.tasks[] array
3. User Deletion → Cascades to delete all user tasks
```

**Implementation Details:**
```javascript
// Task Creation Flow
const createTask = async (taskData) => {
  // 1. Create task
  const newTask = new Task(taskData);
  const savedTask = await newTask.save();
  
  // 2. Update user's tasks array
  await User.findByIdAndUpdate(
    taskData.userId,
    { $push: { tasks: savedTask._id } }
  );
  
  return savedTask;
};

// Task Deletion Flow
const deleteTask = async (taskId) => {
  const task = await Task.findById(taskId);
  
  // 1. Remove from user's tasks array
  await User.findByIdAndUpdate(
    task.userId,
    { $pull: { tasks: taskId } }
  );
  
  // 2. Delete the task
  await Task.findByIdAndDelete(taskId);
};
```

---

### 2. TASK ↔ SKILL RELATIONSHIP
```
Relationship Type: Many-to-Many (Tasks can develop multiple Skills, Skills can be improved by multiple Tasks)
Implementation: Reference arrays with population

TASK MODEL:
{
  _id: ObjectId,
  relatedSkills: [ObjectId], // Array of Skill references
  // ... other fields
}

SKILL MODEL:
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  progress: Number,
  // ... other fields
}

DATA FLOW:
1. Task completion → Updates related skills progress
2. Skill progress → Influences task recommendations
3. Task-skill associations → Enable skill-based task filtering
```

**Implementation Details:**
```javascript
// Populate skills in task queries
const getTasksWithSkills = async (userId) => {
  return await Task.find({ userId })
    .populate('relatedSkills', 'name category progress level')
    .exec();
};

// Update skill progress when task completed
const completeTask = async (taskId) => {
  const task = await Task.findById(taskId).populate('relatedSkills');
  
  // Update task status
  task.status = 'Completed';
  task.completedAt = new Date();
  await task.save();
  
  // Update related skills progress
  for (const skill of task.relatedSkills) {
    skill.progress = Math.min(skill.progress + 5, 100); // +5 progress per task
    skill.lastStudiedAt = new Date();
    await skill.save();
  }
};
```

---

### 3. TASK ↔ POMODORO SESSION RELATIONSHIP
```
Relationship Type: One-to-Many (One Task can have multiple Pomodoro Sessions)
Implementation: Bidirectional references with aggregation

TASK MODEL:
{
  _id: ObjectId,
  pomodoroSessions: [ObjectId], // Array of PomodoroSession references
  pomodoroCount: Number, // Cached count for performance
  actualTime: Number, // Aggregated from sessions
  // ... other fields
}

POMODORO_SESSION MODEL:
{
  _id: ObjectId,
  userId: ObjectId,
  taskId: ObjectId, // Reference to Task (optional)
  duration: Number,
  status: String,
  startTime: Date,
  endTime: Date,
  // ... other fields
}

DATA FLOW:
1. Pomodoro session creation → Links to task (optional)
2. Session completion → Updates task's actualTime and pomodoroCount
3. Task completion → Aggregates time from all sessions
```

**Implementation Details:**
```javascript
// Create pomodoro session linked to task
const createPomodoroSession = async (sessionData) => {
  const session = new PomodoroSession(sessionData);
  const savedSession = await session.save();
  
  // If linked to a task, update task references
  if (sessionData.taskId) {
    await Task.findByIdAndUpdate(
      sessionData.taskId,
      {
        $push: { pomodoroSessions: savedSession._id },
        $inc: { 
          pomodoroCount: 1,
          actualTime: sessionData.duration
        }
      }
    );
  }
  
  return savedSession;
};

// Get task with pomodoro session details
const getTaskWithSessions = async (taskId) => {
  return await Task.findById(taskId)
    .populate({
      path: 'pomodoroSessions',
      select: 'duration status startTime endTime moodBefore moodAfter'
    })
    .exec();
};
```

---

### 4. TASK ↔ CHALLENGE RELATIONSHIP
```
Relationship Type: Many-to-One (Many Tasks can belong to One Challenge)
Implementation: Reference-based with challenge progress tracking

TASK MODEL:
{
  _id: ObjectId,
  challenge: ObjectId, // Reference to Challenge (optional)
  // ... other fields
}

CHALLENGE MODEL:
{
  _id: ObjectId,
  title: String,
  description: String,
  tasks: [ObjectId], // Array of Task references
  participants: [{
    user: ObjectId,
    status: String,
    startedAt: Date,
    completedAt: Date
  }],
  // ... other fields
}

DATA FLOW:
1. Task assigned to challenge → Updates challenge.tasks[] array
2. Task completion → Updates challenge progress for user
3. Challenge completion → Triggers rewards and achievements
```

**Implementation Details:**
```javascript
// Assign task to challenge
const assignTaskToChallenge = async (taskId, challengeId) => {
  // Update task
  await Task.findByIdAndUpdate(taskId, { challenge: challengeId });
  
  // Update challenge
  await Challenge.findByIdAndUpdate(
    challengeId,
    { $push: { tasks: taskId } }
  );
};

// Check challenge progress when task completed
const updateChallengeProgress = async (taskId) => {
  const task = await Task.findById(taskId).populate('challenge');
  
  if (task.challenge) {
    const challenge = task.challenge;
    const userTasks = await Task.find({
      challenge: challenge._id,
      userId: task.userId
    });
    
    const completedTasks = userTasks.filter(t => t.status === 'Completed');
    const progressPercentage = (completedTasks.length / userTasks.length) * 100;
    
    // Update participant status
    const participant = challenge.participants.find(p => 
      p.user.toString() === task.userId.toString()
    );
    
    if (participant && progressPercentage === 100) {
      participant.status = 'Completed';
      participant.completedAt = new Date();
      await challenge.save();
    }
  }
};
```

---

### 5. TASK ↔ MOOD LOG RELATIONSHIP
```
Relationship Type: Embedded + Referenced (Tasks store mood data, MoodLogs provide detailed tracking)
Implementation: Dual storage for different use cases

TASK MODEL:
{
  _id: ObjectId,
  moodBefore: String, // Embedded for quick access
  moodAfter: String,  // Embedded for quick access
  // ... other fields
}

MOOD_LOG MODEL:
{
  _id: ObjectId,
  userId: ObjectId,
  moodType: String,
  sessionType: String, // 'Before Pomodoro' | 'After Pomodoro'
  note: String,
  createdAt: Date
}

DATA FLOW:
1. Task start → Records moodBefore in task + creates MoodLog
2. Task completion → Records moodAfter in task + creates MoodLog
3. Mood analysis → Aggregates data from both sources
```

**Implementation Details:**
```javascript
// Record mood when starting task
const startTask = async (taskId, moodBefore) => {
  // Update task
  await Task.findByIdAndUpdate(taskId, {
    status: 'In Progress',
    moodBefore
  });
  
  // Create mood log
  const task = await Task.findById(taskId);
  await MoodLog.create({
    userId: task.userId,
    moodType: moodBefore,
    sessionType: 'Before Pomodoro',
    note: `Starting task: ${task.title}`
  });
};

// Record mood when completing task
const completeTask = async (taskId, moodAfter) => {
  // Update task
  await Task.findByIdAndUpdate(taskId, {
    status: 'Completed',
    moodAfter,
    completedAt: new Date()
  });
  
  // Create mood log
  const task = await Task.findById(taskId);
  await MoodLog.create({
    userId: task.userId,
    moodType: moodAfter,
    sessionType: 'After Pomodoro',
    note: `Completed task: ${task.title}`
  });
};
```

---

## 📊 AGGREGATION PIPELINES

### 1. Task Analytics Pipeline
```javascript
const getTaskAnalytics = async (userId) => {
  return await Task.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        totalEstimatedTime: { $sum: '$estimatedTime' },
        totalActualTime: { $sum: '$actualTime' },
        averagePomodoroCount: { $avg: '$pomodoroCount' },
        moodImprovements: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$moodBefore', null] },
                  { $ne: ['$moodAfter', null] },
                  { $gt: ['$moodAfter', '$moodBefore'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        totalTasks: 1,
        completedTasks: 1,
        completionRate: {
          $multiply: [
            { $divide: ['$completedTasks', '$totalTasks'] },
            100
          ]
        },
        timeAccuracy: {
          $multiply: [
            { $divide: ['$totalEstimatedTime', '$totalActualTime'] },
            100
          ]
        },
        averagePomodoroCount: { $round: ['$averagePomodoroCount', 2] },
        moodImprovementRate: {
          $multiply: [
            { $divide: ['$moodImprovements', '$completedTasks'] },
            100
          ]
        }
      }
    }
  ]);
};
```

### 2. Category-wise Task Distribution
```javascript
const getCategoryDistribution = async (userId) => {
  return await Task.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        totalTime: { $sum: '$actualTime' },
        averageTime: { $avg: '$actualTime' }
      }
    },
    {
      $project: {
        category: '$_id',
        count: 1,
        completed: 1,
        completionRate: {
          $multiply: [{ $divide: ['$completed', '$count'] }, 100]
        },
        totalTime: 1,
        averageTime: { $round: ['$averageTime', 2] }
      }
    },
    { $sort: { count: -1 } }
  ]);
};
```

### 3. Time-based Task Trends
```javascript
const getTaskTrends = async (userId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        tasksCreated: { $sum: 1 },
        tasksCompleted: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        totalTime: { $sum: '$actualTime' }
      }
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day'
          }
        },
        tasksCreated: 1,
        tasksCompleted: 1,
        totalTime: 1,
        productivity: {
          $divide: ['$tasksCompleted', '$tasksCreated']
        }
      }
    },
    { $sort: { date: 1 } }
  ]);
};
```

---

## 🔄 DATA SYNCHRONIZATION

### 1. Cascade Operations
```javascript
// User deletion cascade
const deleteUserAndData = async (userId) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Delete all user tasks
      await Task.deleteMany({ userId }, { session });
      
      // Delete all user skills
      await Skill.deleteMany({ userId }, { session });
      
      // Delete all user pomodoro sessions
      await PomodoroSession.deleteMany({ userId }, { session });
      
      // Delete all user mood logs
      await MoodLog.deleteMany({ userId }, { session });
      
      // Remove user from challenges
      await Challenge.updateMany(
        { 'participants.user': userId },
        { $pull: { participants: { user: userId } } },
        { session }
      );
      
      // Finally delete the user
      await User.findByIdAndDelete(userId, { session });
    });
  } finally {
    await session.endSession();
  }
};
```

### 2. Data Consistency Checks
```javascript
// Verify task-user relationship consistency
const verifyTaskUserConsistency = async () => {
  const inconsistencies = [];
  
  // Find tasks with invalid user references
  const tasksWithInvalidUsers = await Task.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $match: { user: { $size: 0 } }
    },
    {
      $project: { _id: 1, userId: 1, title: 1 }
    }
  ]);
  
  if (tasksWithInvalidUsers.length > 0) {
    inconsistencies.push({
      type: 'orphaned_tasks',
      count: tasksWithInvalidUsers.length,
      items: tasksWithInvalidUsers
    });
  }
  
  // Find users with invalid task references
  const users = await User.find({}).populate('tasks');
  for (const user of users) {
    const invalidTaskRefs = user.tasks.filter(task => !task);
    if (invalidTaskRefs.length > 0) {
      inconsistencies.push({
        type: 'invalid_task_references',
        userId: user._id,
        count: invalidTaskRefs.length
      });
    }
  }
  
  return inconsistencies;
};
```

---

## 🚀 PERFORMANCE OPTIMIZATIONS

### 1. Database Indexes
```javascript
// Recommended indexes for optimal query performance
const createIndexes = async () => {
  // Task indexes
  await Task.collection.createIndex({ userId: 1, status: 1 });
  await Task.collection.createIndex({ userId: 1, dueDate: 1 });
  await Task.collection.createIndex({ userId: 1, priority: 1 });
  await Task.collection.createIndex({ userId: 1, category: 1 });
  await Task.collection.createIndex({ userId: 1, isImportant: 1 });
  await Task.collection.createIndex({ tags: 1 });
  await Task.collection.createIndex({ challenge: 1 });
  await Task.collection.createIndex({ relatedSkills: 1 });
  
  // Compound indexes for common queries
  await Task.collection.createIndex({ 
    userId: 1, 
    status: 1, 
    priority: 1 
  });
  
  await Task.collection.createIndex({ 
    userId: 1, 
    dueDate: 1, 
    status: 1 
  });
};
```

### 2. Query Optimization
```javascript
// Optimized task retrieval with selective population
const getOptimizedUserTasks = async (userId, options = {}) => {
  let query = Task.find({ userId });
  
  // Selective field projection
  if (options.fields) {
    query = query.select(options.fields);
  }
  
  // Conditional population based on needs
  if (options.includeSkills) {
    query = query.populate('relatedSkills', 'name category progress');
  }
  
  if (options.includeSessions) {
    query = query.populate('pomodoroSessions', 'duration status startTime');
  }
  
  if (options.includeChallenge) {
    query = query.populate('challenge', 'title difficulty');
  }
  
  // Pagination
  if (options.page && options.limit) {
    const skip = (options.page - 1) * options.limit;
    query = query.skip(skip).limit(options.limit);
  }
  
  // Sorting
  if (options.sort) {
    query = query.sort(options.sort);
  }
  
  return await query.lean(); // Use lean() for read-only operations
};
```

### 3. Caching Strategy
```javascript
// Redis caching for frequently accessed data
const getCachedUserTasks = async (userId) => {
  const cacheKey = `user_tasks:${userId}`;
  
  // Try to get from cache first
  let tasks = await redis.get(cacheKey);
  
  if (tasks) {
    return JSON.parse(tasks);
  }
  
  // If not in cache, fetch from database
  tasks = await Task.find({ userId })
    .populate('relatedSkills', 'name progress')
    .lean();
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(tasks));
  
  return tasks;
};

// Invalidate cache when tasks are modified
const invalidateTaskCache = async (userId) => {
  await redis.del(`user_tasks:${userId}`);
  await redis.del(`task_analytics:${userId}`);
};
```

This comprehensive relationship documentation provides a complete understanding of how tasks interact with all other components in your system, enabling you to build a UI that leverages these deep connections effectively.