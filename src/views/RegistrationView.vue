<template>
  <div class="registration">
    <h1>Please fill out the form if you are interested in joining the LCC</h1>

    <form>
      <label class="blue" for="summonerName">Summoner Name:</label><br />
      <input type="text" id="summonerName" name="summonerName" /><br />
      <label class="blue" for="tag">Tag:</label><br />
      <input type="text" id="tag" name="tag" /><br />
      <label class="blue" for="email">Email:</label><br />
      <input type="email" id="email" name="email" /><br />

      <p class="blue">Primary Role:</p>
      <input type="radio" id="top" name="primaryRole" value="top" />
      <label for="top">Top</label><br />
      <input type="radio" id="jungle" name="primaryRole" value="jungle" />
      <label for="jungle">Jungle</label><br />
      <input type="radio" id="mid" name="primaryRole" value="mid" />
      <label for="mid">Mid</label><br />
      <input type="radio" id="adc" name="primaryRole" value="adc" />
      <label for="adc">ADC</label><br />
      <input type="radio" id="support" name="primaryRole" value="support" />
      <label for="support">Support</label><br />

      <p class="blue">Secondary Role:</p>
      <input type="radio" id="top2" name="secondaryRole" value="top" />
      <label for="top2">Top</label><br />
      <input type="radio" id="jungle2" name="secondaryRole" value="jungle" />
      <label for="jungle2">Jungle</label><br />
      <input type="radio" id="mid2" name="secondaryRole" value="mid" />
      <label for="mid2">Mid</label><br />
      <input type="radio" id="adc2" name="secondaryRole" value="adc" />
      <label for="adc2">ADC</label><br />
      <input type="radio" id="support2" name="secondaryRole" value="support" />
      <label for="support2">Support</label><br />

      <label class="blue" for="availability">Common Availability in EST:</label><br />
      <input type="text" id="availability" name="availability" /><br />
      <label class="blue" for="reason">Why you should be picked?</label><br />
      <textarea id="reason" name="reason"></textarea><br />

      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .registration {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
