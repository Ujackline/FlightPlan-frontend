
<template>

  <div class="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
    <!-- Personalized Greeting with Eagle Flight Plan Title -->
    <div class="container mx-auto px-4 py-6 max-w-4xl text-center">
      <h1 class="text-5xl font-bold text-blue-800 mb-4">EAGLE FLIGHT PLAN</h1>
      <p class="text-red-500 mt-2 text-sm"> Hello {{ firstName }}</p>
      <p v-if="flightPlan">Current Flight Plan: {{ flightPlan.name }}</p>

      <p class="text-gray-600 text-lg">Stay on track with your Eagle Flight Plan</p>
    </div>


    <!-- Flight Plan Progress & Points System -->
    <div class="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-1 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex flex-wrap justify-between items-center">
          <div class="w-full md:w-2/3">
            <h2 class="text-lg font-bold text-gray-900">Your Eagle Flight Progress</h2>
            <progress :value="progress" max="100" class="w-full h-3 mt-2 bg-gray-300 rounded"></progress>
            <p class="text-sm text-gray-600 mt-1">{{ progress }}% completed</p>
          </div>
          <div class="w-full md:w-1/3 mt-4 md:mt-0 p-4 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 class="text-xl font-semibold text-gray-900">Points & Rewards</h2>
            <p class="text-lg font-bold text-indigo-600">{{ points }} Points</p>
            <button class="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Redeem Rewards</button>
          </div>
        </div>
      </div>
    </div>
  </div>
        
          <!-- Career Readiness Checklist & My Experiences in Two Tables -->
    <div class="container mx-auto px-4 py-8 max-w-6xl grid grid-cols-2 gap-6">
      <!-- Career Tasks Table -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-3xl font-bold text-burgundy mb-4 text-center">Career Readiness</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-blue-200 text-gray-700 uppercase text-sm">
                <th class="py-3 px-6 text-left">Task</th>
                <th class="py-3 px-6 text-center">Completed</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm bg-blue-50">
              <tr v-for="(task) in careerTasks" :key="task.id" class="border-b hover:bg-gray-100">
  <td class="py-3 px-6">{{ task.name }}</td>
  <td class="py-3 px-6 text-center">
    <input
  type="checkbox"
  v-model="task.completed"
  @change="() => submitTask(task)"
  class="form-checkbox h-5 w-5 text-blue-600"
/>

  </td>
</tr>

            </tbody>
          </table>
        </div>
        <div class="text-center mt-4">
          <button @click="saveChecklist" class="p-2 bg-green-600 text-white rounded hover:bg-green-700">Save Checklist</button>
        </div>
      </div>


      <!-- My Experiences Table -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-3xl font-bold text-burgundy mb-4 text-center">My Experiences</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-blue-200 text-gray-700 uppercase text-sm">
                <th class="py-3 px-6 text-left">Experience</th>
                <th class="py-3 px-6 text-left">Details</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm bg-blue-50">
              <tr v-for="(experience) in experiences" :key="experience.id" class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6 whitespace-nowrap">{{ experience.name }}</td>
                <td class="py-3 px-6 whitespace-nowrap">
                  <details>
                    <summary class="cursor-pointer font-bold text-blue-600">View Details</summary>
                    <div class="mt-2 text-sm text-gray-700 space-y-1 pl-4">
                      <p><strong>Category:</strong> {{ experience.category }}</p>
                      <p><strong>Description:</strong> {{ experience.description }}</p>
                      <p><strong>Type:</strong> {{ experience.type }}</p>
                      <p><strong>Clifton Strength:</strong> {{ experience.cliftonStrength }}</p>
                      <p><strong>Major:</strong> {{ experience.major }}</p>
                      <p><strong>Points:</strong> {{ experience.points }}</p>
                      <p><strong>Status:</strong> {{ experience.status }}</p>
                      <p v-if="experience.completionDate"><strong>Completion Date:</strong> {{ experience.completionDate }}</p>
                      <p v-if="experience.approvedBy"><strong>Approved By:</strong> {{ experience.approvedBy }}</p>
                    </div>
                  </details>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Upcoming Events & Dates -->
    <div class="container mx-auto px-4 py-8 max-w-6xl text-center">
      <h2 class="text-3xl font-bold text-burgundy mb-4">Upcoming Events</h2>
    </div>
    <div class="container mx-auto px-4 py-6 max-w-6xl bg-white rounded-lg shadow-lg p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr class="bg-blue-200 text-gray-700 uppercase text-sm">
              <th class="py-3 px-6 text-left">Event Name</th>
              <th class="py-3 px-6 text-left">Date</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm bg-blue-50">
            <tr v-for="event in upcomingEvents" :key="event.id" class="border-b border-gray-200 hover:bg-gray-100">
              <td class="py-3 px-6 whitespace-nowrap">{{ event.name }}</td>
              <td class="py-3 px-6 whitespace-nowrap">{{ event.date }}</td>
              <td class="py-3 px-6">{{ event.deadline }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Utils from '../config/utils';
import userServices from '../services/userServices';
import taskServices from '../services/taskServices.js';
import experienceServices from '../services/experienceServices.js';
import eventServices from '../services/eventServices.js';
import studentServices from '../services/studentServices';
import flightPlanServices from '../services/flightPlanServices'

export default {
  setup() {
    const firstName = ref('Guest');
    const careerTasks = ref([]);
    const experiences = ref([]);
    const upcomingEvents = ref([]);
    const points = ref(0);
    const progress = ref(0);
    const flightPlan = ref(null);

    const submitTask = async (task) => {
      if (!task || !task.id) {
        console.error("Invalid task in submitTask:", task);
        return;
      }

      try {
        await taskServices.markComplete(task.id);
        task.status = "Pending";
        alert("Task submitted for admin review.");
      } catch (error) {
        console.error("Error submitting task:", error);
      }
    };


    const fetchFlightPlanForSemester = async () => {
  try {
    const storedUser = Utils.getStore("user");
    const studentRes = await studentServices.getStudentById(storedUser.id); // fetch full student
    console.log("here", studentRes)

    const semester = studentRes.semester; // ✅ pull semester from backend
    const response = await flightPlanServices.getFlightPlanBySemester(storedUser.id, semester);

    flightPlan.value = response.data;
  } catch (error) {
    console.error("Error fetching flight plan:", error);
  }
};


    const fetchUser = async () => {
  console.log("Fetching user...");

  try {
    const storedUser = Utils.getStore("user");
    if (!storedUser || !storedUser.id) {
      console.warn("No user ID found.");
      return;
    }

    const response = await userServices.getOne(storedUser.id); // 
    console.log("User response:", response.data); // Debug

    if (response.data?.fName) {
      firstName.value = response.data.fName;
    }
  } catch (err) {
    console.error("Error fetching user:", err);
  }
};

    const fetchAllData = async () => {
      try {

        const storedUser = Utils.getStore("user");
        console.log("Stored user:", storedUser); 
        if (!storedUser || !storedUser.id) {
          console.warn("No user ID found.");
          return;
        }

        const [taskRes, expRes, eventRes, pointsRes] = await Promise.all([
          taskServices.getAllTasks(),
          experienceServices.getExperiences(),
          eventServices.getAll(),
          studentServices.getStudentPoints(storedUser.id),
        ]);

        careerTasks.value = taskRes.data || [];
        experiences.value = expRes; 
        upcomingEvents.value = eventRes.data || [];
        points.value = pointsRes.data?.total || 0;
        console.log("your experiences:", expRes);


        calculateProgress();
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };




    const calculateProgress = () => {
      const totalTasks = careerTasks.value.length;
      const completedTasks = careerTasks.value.filter(t => t.completed).length;

      const totalExperiences = experiences.value.length;
      const completedExperiences = experiences.value.filter(e => e.completed).length;

      const total = totalTasks + totalExperiences;
      const completed = completedTasks + completedExperiences;

      progress.value = total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const saveChecklist = async () => {
      try {
        const updates = careerTasks.value.map(task =>
          taskServices.updateTask(task._id, { completed: task.completed })
        );
        await Promise.all(updates);
        calculateProgress();
      } catch (err) {
        console.error("Error saving tasks:", err);
      }
    };

    onMounted(async () => {

      await fetchUser();   // ✅ wait for this
      submitTask();
      fetchFlightPlanForSemester();
      await fetchAllData();   // ✅ now fetch points (inside this maybe)

});


    watch([careerTasks, experiences], () => {
      calculateProgress();
    });

    return {
      firstName,
      points,
      progress,
      careerTasks,
      experiences,
      upcomingEvents,
      flightPlan,
      saveChecklist,
    };
  }
};
</script>


<style>
.text-blue-800 {
  color: #2b6cb0;
}

.home-container {
  text-align: center;
  padding: 50px;
}

.task-link {
  font-size: 20px;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}

.task-link:hover {
  color: #0056b3;
}

</style>

