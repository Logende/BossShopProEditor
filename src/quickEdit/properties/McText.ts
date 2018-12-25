import { Component, Prop, Vue } from "vue-property-decorator";
import { CreateElement } from "vue";
import "./McText.scss";

interface IBlock {
    color?: string;
    style: string[];
    text: string;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

@Component
export default class McText extends Vue {

    @Prop({ type: String })
    text!: string;

    private timer: any;

    render(h: CreateElement) {

        if (!this.text) { return; }

        const regex = /([&][0-9a-fk-or])?([^&]*)/gm;
        let m;
        const blocks: IBlock[] = [this.generateEmptyBlock()];

        while ((m = regex.exec(this.text)) !== null) {

            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            let lastBlock = blocks[blocks.length - 1];

            // check whether we have any formatting codes in here
            if (m[1]) {

                // check if this is a color code
                if (/^[0-9a-f]$/.test(m[1][1])) {
                    if (lastBlock.text) {
                        lastBlock = this.cloneBlock(lastBlock);
                        blocks.push(lastBlock);
                    }
                    lastBlock.color = m[1][1];
                } else if (/^[k-o]$/.test(m[1][1])) {
                    if (lastBlock.text) {
                        lastBlock = this.cloneBlock(lastBlock);
                        blocks.push(lastBlock);
                    }
                    if (!lastBlock.style.includes(m[1][1])) {
                        lastBlock.style.push(m[1][1]);
                    }
                } else if (m[1] === "&r") {
                    if (lastBlock.text) {
                        lastBlock = this.generateEmptyBlock();
                        blocks.push(lastBlock);
                    } else {
                        lastBlock.style = [];
                        lastBlock.color = undefined;
                    }
                }

            }

            lastBlock.text += m[2];

        }

        const elements = blocks.map((b) => {
            return h("span", {
                class: b.style.concat(b.color || []).map((x) => "mc-" + x),
                attrs: { "data-length": b.text.length.toString() }
            }, b.text);
        });
        return h("span", { class: "mc-preview" }, elements);

    }

    mounted() {
        this.timer = setInterval(() => { this.updateObfuscated(); }, 50);
    }

    beforeDestroy() {
        clearInterval(this.timer);
    }

    updateObfuscated() {
        if (this.$el.nodeType !== 1) { return; }
        const blocks = this.$el.getElementsByClassName("mc-k");
        for (const b of blocks) {
            const len = b.getAttribute("data-length");
            if (len) {
                b.textContent = this.generateRandomString(parseInt(len, 10));
            }
        }
    }

    generateEmptyBlock(): IBlock {
        return { text: "", style: [] };
    }

    cloneBlock(oldBlock: IBlock): IBlock {
        return {
            color: oldBlock.color,
            style: oldBlock.style.slice(),
            text: ""
        };
    }

    generateRandomString(length: number) {
        let str = "";
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    }

}
