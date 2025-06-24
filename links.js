const isTest = true; // ← ここが true だとテスト、false だと本番！

const address = isTest
  ? 'kumikoetest@palcoop.or.jp'
  : 'tos_oka2@palcoop.or.jp';

const voiceLinks = isTest
  ? {
      koe: "./kumikoeTest.html",
      request: "./youbouTest.html",
      disappointing: "./disappointingTest.html"
    }
  : {
      koe: "./kumikoe.html",
      request: "./youbou.html",
      disappointing: "./disappointing.html"
    };
