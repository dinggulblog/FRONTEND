<template>
  <div class="spinner">
    <div class="row cf">
      <div class="span">
        <div class="coffee_cup">
          <div class="coffee_fill"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 965px;
  }

  .row {
    text-align: center;
  }

  .span {
    border-radius: 1px;
    margin-right: 100px;
  }

  .span:last-child {
    margin-right: 0px;
  }

  .cf:before,
  .cf:after {
    content: ' ';
    /* 1 */
    display: table;
    /* 2 */
  }

  .cf:after {
    clear: both;
  }

  .coffee_cup {
    width: 20px;
    height: 24px;
    border: 2px solid;
    border-color: var(--point);
    border-radius: 0px 0px 5px 5px;
    position: relative;
    margin: 36px auto;

    .coffee_fill {
      background: rgba(138, 165, 148, 0.7);
      width: 100%;
      height: 90%;
      position: relative;
      top: 2px;
    }
  }

  .coffee_cup:after,
  .coffee_cup:before {
    position: absolute;
    content: '';
  }

  .coffee_cup:after {
    width: 5px;
    height: 12px;
    border: 2px solid;
    border-color: var(--point);
    border-left: none;
    border-radius: 0px 20px 20px 0px;
    left: 19px;
    top: 2px;
  }

  .coffee_cup:before {
    width: 2px;
    height: 6px;
    background-color: var(--point);
    top: -10px;
    left: 2px;

    box-shadow: 5px 0px 0px 0px var(--point), 5px -5px 0px 0px var(--point), 10px 0px 0px 0px var(--point);
    -webkit-animation: steam 1s linear infinite alternate;
    -moz-animation: steam 1s linear infinite alternate;
    animation: steam 1s linear infinite alternate;
  }

  @-webkit-keyframes steam {
    0% {
      height: 0px;
    }

    100% {
      height: 6px;
    }
  }

  @-moz-keyframes steam {
    0% {
      height: 0px;
    }

    100% {
      height: 6px;
    }
  }

  @keyframes steam {
    0% {
      height: 0px;
    }

    100% {
      height: 6px;
    }
  }
</style>
