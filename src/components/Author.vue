<template>
  <div class="profile">
    <div class="info">
      <div class="profileImg"></div>
      <div class="author">
        <h2>밍구</h2>
        <p>프론트엔드 개발자 지망생</p>
      </div>
    </div>

    <dIV class="greetings">
      개발자가 되고싶은 멍뭉이 입니다.<br />
      좋아하는것은 스타크래프트..와 온돈이
    </dIV>
  </div>
</template>

<script>
export default {
  name: 'Profile',
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.profile {
  display: grid;
  grid-template-rows: auto auto;
  gap: 2.4rem 0;
  padding-top: 4.8rem;
  margin: 4.8rem 0 0;
  letter-spacing: normal;
  font-size: 1.4rem;
  border-top: 1px solid var(--line);

  .info {
    grid-row: 1 / 2;
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    gap: 0 1.6rem;

    .profileImg {
      grid-column: 1 / 2;
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      background: #e6e6e6;
      background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }

    .author {
      grid-column: 2 / 3;

      h2 {
        color: var(--primary);
        font-weight: 500;
        font-size: 1.6rem;
      }

      p {
        color: var(--sub);
        font-weight: 300;
      }
    }
  }

  .greetings {
    grid-row: 2 / 3;
    color: var(--secondary);
    line-height: 2.8rem;
  }
}
</style>
