import { apiserverPrivateIp, workers } from "../../helpers.ts";
import { privateNetworks } from "../../helpers.ts";

const yaml = String.raw;

const internalIpRanges = "[" + privateNetworks.map((pn) => pn.cidr).join(", ") + "]";
const externalIpRanges = "[" + workers.map((node) => `${node.publicIp}/32`).join(", ") + "]";

export default yaml`
---
# Kubernetes dashboard
# RBAC required. see docs/getting-started.md for access details.
# dashboard_enabled: false

# Helm deployment
helm_enabled: false

# Registry deployment
registry_enabled: false 
# registry_namespace: kube-system
# registry_storage_class: ""
# registry_disk_size: "10Gi"

# Metrics Server deployment
metrics_server_enabled: true 
# metrics_server_container_port: 10250
# metrics_server_kubelet_insecure_tls: true
# metrics_server_metric_resolution: 15s
# metrics_server_kubelet_preferred_address_types: "InternalIP,ExternalIP,Hostname"
# metrics_server_host_network: false
# metrics_server_replicas: 1

# Rancher Local Path Provisioner
local_path_provisioner_enabled: true 
# local_path_provisioner_namespace: "local-path-storage"
# local_path_provisioner_storage_class: "local-path"
# local_path_provisioner_reclaim_policy: Delete
# local_path_provisioner_claim_root: /opt/local-path-provisioner/
# local_path_provisioner_debug: false
# local_path_provisioner_image_repo: "{{ docker_image_repo }}/rancher/local-path-provisioner"
# local_path_provisioner_image_tag: "v0.0.24"
# local_path_provisioner_helper_image_repo: "busybox"
# local_path_provisioner_helper_image_tag: "latest"

# Local volume provisioner deployment
local_volume_provisioner_enabled: true 
# local_volume_provisioner_namespace: kube-system
# local_volume_provisioner_nodelabels:
#   - kubernetes.io/hostname
#   - topology.kubernetes.io/region
#   - topology.kubernetes.io/zone
# local_volume_provisioner_storage_classes:
#   local-storage:
#     host_dir: /mnt/disks
#     mount_dir: /mnt/disks
#     volume_mode: Filesystem
#     fs_type: ext4
#   fast-disks:
#     host_dir: /mnt/fast-disks
#     mount_dir: /mnt/fast-disks
#     block_cleaner_command:
#       - "/scripts/shred.sh"
#       - "2"
#     volume_mode: Filesystem
#     fs_type: ext4
# local_volume_provisioner_tolerations:
#   - effect: NoSchedule
#     operator: Exists

# CSI Volume Snapshot Controller deployment, set this to true if your CSI is able to manage snapshots
# currently, setting cinder_csi_enabled=true would automatically enable the snapshot controller
# Longhorn is an external CSI that would also require setting this to true but it is not included in kubespray
# csi_snapshot_controller_enabled: false
# csi snapshot namespace
# snapshot_controller_namespace: kube-system

# CephFS provisioner deployment
cephfs_provisioner_enabled: false
# cephfs_provisioner_namespace: "cephfs-provisioner"
# cephfs_provisioner_cluster: ceph
# cephfs_provisioner_monitors: "172.24.0.1:6789,172.24.0.2:6789,172.24.0.3:6789"
# cephfs_provisioner_admin_id: admin
# cephfs_provisioner_secret: secret
# cephfs_provisioner_storage_class: cephfs
# cephfs_provisioner_reclaim_policy: Delete
# cephfs_provisioner_claim_root: /volumes
# cephfs_provisioner_deterministic_names: true

# RBD provisioner deployment
rbd_provisioner_enabled: false
# rbd_provisioner_namespace: rbd-provisioner
# rbd_provisioner_replicas: 2
# rbd_provisioner_monitors: "172.24.0.1:6789,172.24.0.2:6789,172.24.0.3:6789"
# rbd_provisioner_pool: kube
# rbd_provisioner_admin_id: admin
# rbd_provisioner_secret_name: ceph-secret-admin
# rbd_provisioner_secret: ceph-key-admin
# rbd_provisioner_user_id: kube
# rbd_provisioner_user_secret_name: ceph-secret-user
# rbd_provisioner_user_secret: ceph-key-user
# rbd_provisioner_user_secret_namespace: rbd-provisioner
# rbd_provisioner_fs_type: ext4
# rbd_provisioner_image_format: "2"
# rbd_provisioner_image_features: layering
# rbd_provisioner_storage_class: rbd
# rbd_provisioner_reclaim_policy: Delete

# Gateway API CRDs
gateway_api_enabled: true 
# gateway_api_experimental_channel: false

# Nginx ingress controller deployment
ingress_nginx_enabled: true 
ingress_nginx_host_network: false
ingress_nginx_service_type: LoadBalancer
ingress_nginx_service_annotations:
  metallb.universe.tf/address-pool: internal
  # example.io/loadbalancerIPs: 1.2.3.4
# ingress_nginx_service_nodeport_http: 30080
# ingress_nginx_service_nodeport_https: 30081
ingress_publish_status_address: ""
# ingress_nginx_nodeselector:
#   kubernetes.io/os: "linux"
# Permit ingress traffic from control plane nodes
ingress_nginx_tolerations:
  - key: "node-role.kubernetes.io/control-plane"
    operator: "Equal"
    value: ""
    effect: "NoSchedule"
# ingress_nginx_namespace: "ingress-nginx"
# ingress_nginx_insecure_port: 80
# ingress_nginx_secure_port: 443
# ingress_nginx_configmap:
#   map-hash-bucket-size: "128"
#   ssl-protocols: "TLSv1.2 TLSv1.3"
# ingress_nginx_configmap_tcp_services:
#   9000: "default/example-go:8080"
# ingress_nginx_configmap_udp_services:
#   53: "kube-system/coredns:53"
# ingress_nginx_extra_args:
#   - --default-ssl-certificate=default/foo-tls
# ingress_nginx_termination_grace_period_seconds: 300
# ingress_nginx_class: nginx
# ingress_nginx_without_class: true
# ingress_nginx_default: false

# ALB ingress controller deployment
ingress_alb_enabled: false
# alb_ingress_aws_region: "us-east-1"
# alb_ingress_restrict_scheme: "false"
# Enables logging on all outbound requests sent to the AWS API.
# If logging is desired, set to true.
# alb_ingress_aws_debug: "false"

# Cert manager deployment
cert_manager_enabled: false
# cert_manager_namespace: "cert-manager"
# cert_manager_tolerations:
#   - key: node-role.kubernetes.io/control-plane
#     effect: NoSchedule
# cert_manager_affinity:
#  nodeAffinity:
#    preferredDuringSchedulingIgnoredDuringExecution:
#    - weight: 100
#      preference:
#        matchExpressions:
#        - key: node-role.kubernetes.io/control-plane
#          operator: In
#          values:
#          - ""
# cert_manager_nodeselector:
#   kubernetes.io/os: "linux"

# cert_manager_trusted_internal_ca: |
#   -----BEGIN CERTIFICATE-----
#   [REPLACE with your CA certificate]
#   -----END CERTIFICATE-----
# cert_manager_leader_election_namespace: kube-system

# cert_manager_dns_policy: "ClusterFirst"
# cert_manager_dns_config:
#   nameservers:
#     - "1.1.1.1"
#     - "8.8.8.8"

# cert_manager_controller_extra_args:
#   - "--dns01-recursive-nameservers-only=true"
#   - "--dns01-recursive-nameservers=1.1.1.1:53,8.8.8.8:53"

# MetalLB deployment
metallb_enabled: true 
metallb_speaker_enabled: "{{ metallb_enabled }}"
metallb_namespace: "metallb-system"
metallb_version: v0.13.9
# Using BGP Layer 3 mode to prevent node elected bottleneck and distribute traffic more efficiently
metallb_protocol: "layer3"
metallb_port: "7472"
metallb_memberlist_port: "7946"
metallb_config:
  # By default only the MetalLB BGP speaker is allowed to run on control plane nodes.
  # If you have a single node cluster or a cluster where control plane are also worker nodes,
  # you may need to enable tolerations for the MetalLB controller
  speaker:
    nodeselector:
      kubernetes.io/os: "linux"
    tolerations:
      - key: "node-role.kubernetes.io/control-plane"
        operator: "Equal"
        value: ""
        effect: "NoSchedule"
  controller:
    nodeselector:
      kubernetes.io/os: "linux"
    tolerations:
      - key: "node-role.kubernetes.io/control-plane"
        operator: "Equal"
        value: ""
        effect: "NoSchedule"
  # To use specific pool for services, you can annotate the service with the following annotation:
  # metallb.universe.tf/address-pool
  address_pools:
    internal:
      ip_range: ${internalIpRanges}
      auto_assign: true
    # external:
    #   ip_range: ${externalIpRanges}
    #   auto_assign: true
  # layer2:
  #   # internal ip is for all services, external ip is for ingresses like nginx ingress controller
  #   - internal 
  #   # - external 
  layer3:
    defaults:
      peer_port: 179
      hold_time: 120s
    communities:
      # internal-only: Routes with this community are only advertised within the internal network
      # Useful for services that should only be accessible within your cluster or private network
      internal-only: "65535:65281"
      # no-external-advertise: Custom community that prevents routes from being advertised to external BGP peers
      # Useful for completely restricting the advertisement of certain service IPs
      no-external-advertise: "65535:65282"
    metallb_peers:
      # Configure BGP peers for each worker node to distribute traffic
      # Each worker node becomes a BGP peer, allowing for more efficient traffic distribution
      # This prevents the node elected bottleneck issue that occurs in Layer 2 mode
      # With BGP, each node can announce service IPs for pods running on that node
      ${workers
        .map(
          (worker) => yaml`
              ${worker.name}:
                peer_address: ${worker.privateIp}
                peer_asn: 64512
                my_asn: 4200000000
                address_pool:
                  - internal
        `)
        .join("\n")}

argocd_enabled: false
# argocd_version: v2.11.0
# argocd_namespace: argocd
# Default password:
#   - https://argo-cd.readthedocs.io/en/stable/getting_started/#4-login-using-the-cli
#   ---
#   The initial password is autogenerated and stored in "argocd-initial-admin-secret" in the argocd namespace defined above.
#   Using the argocd CLI the generated password can be automatically be fetched from the current kubectl context with the command:
#   argocd admin initial-password -n argocd
#   ---
# Use the following var to set admin password
# argocd_admin_password: "password"

# The plugin manager for kubectl
krew_enabled: false
krew_root_dir: "/usr/local/krew"

# Kube VIP
kube_vip_enabled: true 
kube_vip_arp_enabled: true
kube_vip_lb_enable: false 
kube_vip_controlplane_enabled: true
kube_vip_address: ${apiserverPrivateIp}  # This becomes the VIP
loadbalancer_apiserver:
  address: "{{ kube_vip_address }}"
  port: 6443
# kube_vip_interface: eth0
# kube_vip_services_enabled: false
# kube_vip_dns_mode: first
# kube_vip_cp_detect: false
# kube_vip_leasename: plndr-cp-lock
kube_vip_enable_node_labeling: true 

# Node Feature Discovery
node_feature_discovery_enabled: true 
# node_feature_discovery_gc_sa_name: node-feature-discovery
# node_feature_discovery_gc_sa_create: false
# node_feature_discovery_worker_sa_name: node-feature-discovery
# node_feature_discovery_worker_sa_create: false
# node_feature_discovery_master_config:
#   extraLabelNs: ["nvidia.com"]
`;
