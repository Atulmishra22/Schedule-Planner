<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/75" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-primary-800 border border-primary-700 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-neutral-100 mb-4"
              >
                {{ task ? 'Edit Task' : 'Add New Task' }}
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Title -->
                <div>
                  <label for="title" class="block text-sm font-medium text-neutral-300 mb-1">
                    Title <span class="text-error-500">*</span>
                  </label>
                  <input
                    id="title"
                    v-model="form.title"
                    type="text"
                    required
                    class="w-full px-3 py-2 bg-primary-900 border border-primary-600 rounded-md 
                           text-neutral-100 placeholder-neutral-500 focus:outline-none 
                           focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>

                <!-- Estimated Duration -->
                <div>
                  <label for="duration" class="block text-sm font-medium text-neutral-300 mb-1">
                    Estimated Duration (minutes) <span class="text-error-500">*</span>
                  </label>
                  <input
                    id="duration"
                    v-model.number="form.duration"
                    type="number"
                    min="5"
                    step="5"
                    required
                    class="w-full px-3 py-2 bg-primary-900 border border-primary-600 rounded-md 
                           text-neutral-100 placeholder-neutral-500 focus:outline-none 
                           focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="30"
                  />
                </div>

                <!-- Category -->
                <div>
                  <label for="category" class="block text-sm font-medium text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    class="w-full px-3 py-2 bg-primary-900 border border-primary-600 rounded-md 
                           text-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent-500 
                           focus:border-transparent"
                  >
                    <option value="work">💼 Work</option>
                    <option value="personal">🏠 Personal</option>
                    <option value="learning">📚 Learning</option>
                    <option value="health">💪 Health</option>
                    <option value="creative">🎨 Creative</option>
                  </select>
                </div>

                <!-- Priority -->
                <div>
                  <label for="priority" class="block text-sm font-medium text-neutral-300 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    v-model="form.priority"
                    class="w-full px-3 py-2 bg-primary-900 border border-primary-600 rounded-md 
                           text-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent-500 
                           focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <!-- Time Slot -->
                <div>
                  <label for="timeSlot" class="block text-sm font-medium text-neutral-300 mb-1">
                    Time Slot
                  </label>
                  <input
                    id="timeSlot"
                    v-model="form.timeSlot"
                    type="time"
                    class="w-full px-3 py-2 bg-primary-900 border border-primary-600 rounded-md 
                           text-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent-500 
                           focus:border-transparent"
                  />
                </div>

                <!-- Recurring -->
                <div class="flex items-center gap-2">
                  <input
                    id="recurring"
                    v-model="form.recurring"
                    type="checkbox"
                    class="w-4 h-4 text-accent-500 bg-primary-900 border-primary-600 rounded 
                           focus:ring-accent-500 focus:ring-2"
                  />
                  <label for="recurring" class="text-sm font-medium text-neutral-300">
                    Recurring Task
                  </label>
                </div>

                <!-- Buttons -->
                <div class="flex gap-3 mt-6">
                  <button
                    type="button"
                    class="flex-1 px-4 py-2 bg-primary-700 hover:bg-primary-600 text-neutral-100 
                           rounded-md text-sm font-medium transition-colors"
                    @click="closeModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="flex-1 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white 
                           rounded-md text-sm font-medium transition-colors"
                  >
                    {{ task ? 'Update' : 'Add' }} Task
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useTasksStore } from '../../stores/tasks';
import { getTodayLocal } from '../../utils/dateHelpers';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  task: {
    type: Object,
    default: null
  },
  date: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['close']);

const tasksStore = useTasksStore();

const form = ref({
  title: '',
  duration: 30,
  category: 'work',
  priority: 'medium',
  timeSlot: '',
  recurring: false
});

// Reset form when modal opens/closes or task changes
watch([() => props.isOpen, () => props.task], () => {
  if (props.isOpen) {
    if (props.task) {
      // Edit mode - populate form
      form.value = {
        title: props.task.title,
        duration: props.task.duration || props.task.estimatedDuration || 30,
        category: props.task.category,
        priority: props.task.priority,
        timeSlot: props.task.timeSlot || '',
        recurring: props.task.recurring || false
      };
    } else {
      // Add mode - reset form
      form.value = {
        title: '',
        duration: 30,
        category: 'work',
        priority: 'medium',
        timeSlot: '',
        recurring: false
      };
    }
  }
});

const closeModal = () => {
  emit('close');
};

const handleSubmit = () => {
  // Validate required fields
  if (!form.value.title || !form.value.title.trim()) {
    alert('Please enter a task title');
    return;
  }
  
  if (!form.value.duration || form.value.duration < 1) {
    alert('Please enter a valid duration (at least 1 minute)');
    return;
  }
  
  console.log('Submitting task:', form.value);
  
  if (props.task) {
    // Update existing task
    tasksStore.updateTask(props.task.id, form.value);
  } else {
    // Add new task
    const taskData = {
      ...form.value,
      date: props.date || getTodayLocal()
    };
    console.log('Adding task with data:', taskData);
    tasksStore.addTask(taskData);
  }
  closeModal();
};
</script>
