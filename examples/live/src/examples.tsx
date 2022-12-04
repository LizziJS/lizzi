import { zzIf, zzObject } from "@lizzi/core";
import { onClick, ViewComponent } from "@lizzi/template";

class Example extends ViewComponent {
  protected embed: string;
  protected modules: string[];

  createUrl() {
    return (
      this.embed +
      `?autoresize=1&expanddevtools=1&fontsize=14&hidenavigation=1&theme=dark&module=${this.modules.join(
        ","
      )},`
    );
  }

  constructor({
    name,
    embed,
    modules,
  }: {
    name: string;
    embed: string;
    modules?: string[];
  }) {
    super();

    this.embed = embed;
    this.modules = modules ? modules : ["/src/app.tsx"];

    this.append(
      <a
        class={[
          "rounded-lg px-2 py-1 cursor-pointer mx-1",
          zzIf(() => selected.value === this, "bg-orange-300", ""),
        ]}
        use={[onClick(() => (selected.value = this))]}
      >
        {name}
      </a>
    );
  }
}

function Header1({ name }: { name: string }) {
  return (
    <h2 class={["bg-sky-300 px-3 py-1 mt-2 font-bold text-lg"]}>{name}</h2>
  );
}

function Header2({ name }: { name: string }) {
  return <h3 class={["px-3 py-1 mt-2 font-bold"]}>{name}</h3>;
}

class ExampleView extends ViewComponent {
  constructor(embed: string) {
    super();

    this.append(
      <iframe
        src={embed}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          border: 0,
          "border-radius": "4px",
          overflow: "hidden",
        }}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    );
  }
}

const selected = new zzObject<Example>(null);

const result = new zzObject<ExampleView>();

selected.onChange.addListener(() => {
  if (selected.value) {
    result.value = new ExampleView(selected.value.createUrl());
  }
});

export function Examples() {
  return (
    <div class="flex w-full h-full absolute">
      <div class="w-[15rem] bg-gray h-full relative flex flex-col gap-1 bg-sky-50	overflow-auto pb-2">
        <Header1 name="Lizzi core" />
        <Header2 name="Reactive variables basics:" />
        <Example
          name="1. Reactive variable"
          embed="https://codesandbox.io/embed/lizzi-reactive-0-nz57ng"
        />
        <Example
          name="2. onChange variable event"
          embed="https://codesandbox.io/embed/lizzi-reactive-1-t0imix"
        />
        <Example
          name="3. Send pointers inside function"
          embed="https://codesandbox.io/embed/lizzi-reactive-2-b-ibw36z"
        />
        <Example
          name="4. Reactive relations"
          embed="https://codesandbox.io/embed/lizzi-reactive-2-o73wqj"
        />
        <Header2 name="Reactive array basics:" />

        <Example
          name="1. Reactive array"
          embed="https://codesandbox.io/embed/lizzi-reactive-3-w2fpuq"
        />
        <Example
          name="2.
      zzArray filter"
          embed="https://codesandbox.io/embed/lizzi-reactive-4-a-74xycb"
        />
        <Example
          name="3. zzArray sort"
          embed="https://codesandbox.io/embed/lizzi-reactive-4-b-u7k6kx"
        />
        <Example
          name="4. zzArray map"
          embed="https://codesandbox.io/embed/lizzi-reactive-4-c-ztkz0l"
        />
        <Example
          name="5. zzArray join"
          embed="https://codesandbox.io/embed/lizzi-reactive-4-d-4qwubp"
        />

        <Header2 name="Reactive array advanced:" />
        <Example
          name="1. Smart adds/removes"
          embed="https://codesandbox.io/embed/lizzi-reactive-5-b-bwbysr"
        />
        <Example
          name="2. Сhains of arrays"
          embed="https://codesandbox.io/embed/lizzi-reactive-5-wuq392"
        />

        <Header2 name="Event basics:" />
        <Example
          name="1. Add listener"
          embed="https://codesandbox.io/embed/lizzi-events-2-08xtys"
        />
        <Example
          name="2. Remove listener"
          embed="https://codesandbox.io/embed/lizzi-events-2-b-cqj88l"
        />
        <Header1 name="Lizzi templates" />
        <Header2 name="Template basics:" />
        <Example
          name="1. Hello world!"
          embed="https://codesandbox.io/embed/lizzi-template-1-ljggzn"
        />
        <Example
          name="2. Click button event"
          embed="https://codesandbox.io/embed/lizzi-template-1-0-a-8o5x63"
        />
        <Example
          name="3. Counter"
          embed="https://codesandbox.io/embed/lizzi-template-1-c-2c10bd"
        />
        <Example
          name="4. If / Else component"
          embed="https://codesandbox.io/embed/lizzi-template-1-b-v4bbh1"
        />
        <Header2 name="HTML attributes:" />
        <Example
          name="1. Reactive style"
          embed="https://codesandbox.io/embed/lizzi-template-1-0-c-iogsro"
        />
        <Example
          name="2. Reactive class"
          embed="https://codesandbox.io/embed/lizzi-template-1-0-b-0hbxrf"
        />
        <Example
          name="3. Reactive attribute"
          embed="https://codesandbox.io/embed/lizzi-template-1-0-d-ifk064"
        />
        <Header2 name="Template components:" />
        <Example
          name="1. ViewComponent class"
          embed="https://codesandbox.io/embed/lizzi-template-1-a-o0i5jv"
        />
        <Example
          name="2. Mount and Unmount ViewComponent"
          embed="https://codesandbox.io/embed/lizzi-template-1-d-ewseuj"
        />
        <Example
          name="3. Mount and Unmount <div>"
          embed="https://codesandbox.io/embed/lizzi-template-1-d-2-xebhw5"
        />
        <Header2 name="Template use events:" />
        <Example
          name="1. use on('event')"
          embed="https://codesandbox.io/embed/lizzi-template-2-f-2-w3qkfs"
        />
        <Example
          name="2. Element use function"
          embed="https://codesandbox.io/embed/lizzi-template-2-f-hdwiwy"
        />
        <Example
          name="3. use EventWrapper sugar"
          embed="https://codesandbox.io/embed/lizzi-template-2-f-1-dfm8u7"
        />
        <Example
          name="4. use timer"
          embed="https://codesandbox.io/embed/lizzi-template-2-f-t-3if861"
        />
        <Header2 name="Components advanced:" />
        <Example
          name="1. Modal"
          embed="https://codesandbox.io/embed/lizzi-template-3-2-f91uxq"
          modules={[
            "/src/app.tsx",
            "/src/main.tsx",
            "/src/modal.tsx",
            "/src/styles.css",
          ]}
        />
        <Example
          name="2. Form"
          embed="https://codesandbox.io/embed/lizzi-template-3-1-d97h78"
          modules={[
            "/src/app.tsx",
            "/src/form.tsx",
            "/src/input.tsx",
            "/src/styles.css",
          ]}
        />
        <Example
          name="3. Flights"
          embed="https://codesandbox.io/embed/lizzi-template-5-c89r36"
          modules={["/src/app.tsx", "/src/airports.ts", "/src/styles.css"]}
        />
        <Example
          name="4. Infinite scroll"
          embed="https://codesandbox.io/embed/lizzi-template-6-059p86"
          modules={[
            "/src/components/FetchApp.tsx",
            "/src/data/product.ts",
            "/src/lib/fetch.ts",
            "/src/lib/urlParams.ts",
            "/src/app.tsx",
            "/src/styles.css",
          ]}
        />
      </div>
      <div class="flex-grow h-full relative">{result}</div>
    </div>
  );
}
