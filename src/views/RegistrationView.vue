<script setup lang="ts"></script>

<template>
  <div class="mx-auto max-w-md p-4">
    <h1 class="dark:text-logo-blue mb-4 text-center text-xl font-semibold">Registration</h1>
    <h2 class="text-l mb-4 text-center font-semibold">
      Please fill out the form if you are interested in joining the LCC
    </h2>

    <form class="flex flex-col gap-4">
      <label
        for="summonerName"
        class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
        >Summoner Name</label
      >
      <div class="flex">
        <span
          class="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
        >
          <svg
            class="h-4 w-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"
            />
          </svg>
        </span>
        <input
          type="text"
          id="summonerName"
          class="dark:text-logo-blue block w-full min-w-0 flex-1 rounded-none rounded-e-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <label for="tag" class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
        >Tag</label
      >
      <div class="flex">
        <span
          class="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
        >
          <svg
            class="h-4 w-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10.1104 2.00608C10.6593 2.06707 11.0548 2.56149 10.9938 3.1104L10.4506 8H14.4383L15.0061 2.88953C15.0671 2.34063 15.5615 1.94509 16.1104 2.00608C16.6593 2.06707 17.0548 2.56149 16.9938 3.1104L16.4506 8H20C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10H16.2283L15.7839 14H20C20.5523 14 21 14.4477 21 15C21 15.5523 20.5523 16 20 16H15.5617L14.9938 21.1104C14.9329 21.6593 14.4384 22.0548 13.8895 21.9938C13.3406 21.9329 12.9451 21.4384 13.0061 20.8895L13.5494 16H9.56167L8.99385 21.1104C8.93286 21.6593 8.43844 22.0548 7.88953 21.9938C7.34063 21.9329 6.94509 21.4384 7.00608 20.8895L7.54936 16H4C3.44772 16 3 15.5523 3 15C3 14.4477 3.44772 14 4 14H7.77159L8.21603 10H4C3.44772 10 3 9.55228 3 9C3 8.44772 3.44772 8 4 8H8.43825L9.00608 2.88953C9.06707 2.34063 9.56149 1.94509 10.1104 2.00608ZM13.7716 14L14.216 10H10.2283L9.78389 14H13.7716Z"
            />
          </svg>
        </span>
        <input
          type="text"
          id="tag"
          class="dark:text-logo-blue block w-full min-w-0 flex-1 rounded-none rounded-e-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900" for="email"
          >Email:</label
        >
        <input
          type="email"
          id="email"
          name="email"
          class="dark:text-logo-blue block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <p class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900">Primary Role:</p>
      <div class="flex flex-col gap-2">
        <div>
          <input type="radio" id="top" name="primaryRole" value="top" class="peer hidden" />
          <label
            for="top"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Top</label
          >
        </div>
        <div>
          <input type="radio" id="jungle" name="primaryRole" value="jungle" class="peer hidden" />
          <label
            for="jungle"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Jungle</label
          >
        </div>
        <div>
          <input type="radio" id="mid" name="primaryRole" value="mid" class="peer hidden" />
          <label
            for="mid"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Mid</label
          >
        </div>
        <div>
          <input type="radio" id="adc" name="primaryRole" value="adc" class="peer hidden" />
          <label
            for="adc"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >ADC</label
          >
        </div>
        <div>
          <input type="radio" id="support" name="primaryRole" value="support" class="peer hidden" />
          <label
            for="support"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Support</label
          >
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900">
          Secondary Role:
        </p>
        <div>
          <input type="radio" id="top2" name="secondaryRole" value="top" class="peer hidden" />
          <label
            for="top2"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Top</label
          >
        </div>
        <div>
          <input
            type="radio"
            id="jungle2"
            name="secondaryRole"
            value="jungle"
            class="peer hidden"
          />
          <label
            for="jungle2"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Jungle</label
          >
        </div>
        <div>
          <input type="radio" id="mid2" name="secondaryRole" value="mid" class="peer hidden" />
          <label
            for="mid2"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Mid</label
          >
        </div>
        <div>
          <input type="radio" id="adc2" name="secondaryRole" value="adc" class="peer hidden" />
          <label
            for="adc2"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >ADC</label
          >
        </div>
        <div>
          <input
            type="radio"
            id="support2"
            name="secondaryRole"
            value="support"
            class="peer hidden"
          />
          <label
            for="support2"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Support</label
          >
        </div>
      </div>

      <div>
        <label
          class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
          for="availability"
          >Common Availability in EST:</label
        >
        <input
          type="text"
          id="availability"
          name="availability"
          class="dark:text-logo-blue block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900" for="reason"
          >Why you should be picked?</label
        >
        <textarea
          id="reason"
          name="reason"
          class="dark:text-logo-blue block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        ></textarea>
      </div>

      <input
        type="submit"
        value="Submit"
        class="bg-logo-blue text-logo-white hover:bg-logo-blue-5 mt-4 cursor-pointer rounded px-4 py-2 font-bold"
      />
    </form>
  </div>
</template>
