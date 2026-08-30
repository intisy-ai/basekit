package io.github.intisy.ai.shared.routing;

import io.github.intisy.ai.tsemit.TsConstant;

/**
 * The keys this package mints.
 *
 * @implNote The Java field type is {@code Object} and its value {@code null} because the Java side
 * never reads a key: a Java host keys on the id string, and the typed key exists for the emitted
 * TypeScript.
 */
public final class ProxyContracts {

    /** The capability a plugin provides to become the app-to-IR front door for one host app. */
    @TsConstant(type = "CapabilityType<FrontDoorCapability>", id = "front-door")
    public static final Object FRONT_DOOR = null;

    /** The id {@link #FRONT_DOOR} names, for a host that resolves capabilities on the JVM. */
    public static final String FRONT_DOOR_ID = "front-door";

    /**
     * The capability a plugin provides to declare one app proxy: its id, its name and its routing.
     *
     * @implNote No typed key beside it, unlike every other id here, because only a JVM host
     * discovers a {@link ProxyPlugin}. A TypeScript host reaches the same app through
     * {@link #FRONT_DOOR}, which is a different shape: the front door SERVES, and a proxy plugin is
     * the declarative thing one is built from. Minting a TypeScript key for it would claim a
     * surface nobody consumes.
     */
    public static final String APP_PROXY_ID = "app-proxy";

    private ProxyContracts() {
    }
}
