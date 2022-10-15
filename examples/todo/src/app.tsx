import { zzF, zzInt } from "@lizzi/core";
import { Body, Title } from "@lizzi/template";

function App() {
  const newI = new zzInt(0);

  return (
    <Title title="1One">
      <div
        use={[
          (view) => {
            const timer = setInterval(() => newI.value++, 100);

            view.onceUnmount(() => {
              clearInterval(timer);
            });
          },
        ]}
      >
        <h1 class={["asd", zzF(() => (newI.value % 2 ? "a" : "b"), newI)]}>
          {123} 123 <span></span>
          {newI}
        </h1>
        <h1 class={["asd"]}>123</h1>
        <svg viewBox="0 0 950 650">
          <a svg></a>
        </svg>
      </div>
    </Title>
  );
}

Body(App());
